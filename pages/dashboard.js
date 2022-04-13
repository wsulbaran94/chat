import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

import { io } from "socket.io-client";
import { Modal, Button } from "react-bootstrap";
import axios from "axios"

import { get } from '../service/HTTP/HTTP';
import Paginate from "../components/Paginate";
import { verifyToken } from "../service/Auth/Auth"
import { alertService } from "../service/Alert/Alert"

const socket = io("http://localhost:4000/");

socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

const Chat = ({socket, username, room}) => {
    const [message, setMessage] = useState('')
    const [messageList, setMessageList] = useState([]);
    const [show, setShow] = useState(false);
    const [giphy, setGiphy] = useState([])
    const [search, setSearch] = useState("");
    let setGiphyMessage = "";

    const [isLoading, setIsLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = giphy.slice(indexOfFirstItem, indexOfLastItem);

    const handleClose = () => setShow(false);
    
    const send = async () => {
        if (message !== "") {
            const data = {
                room,
                username,
                message,
                time:
                    new Date(Date.now()).getHours() +
                    ":" +
                    new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send-message", data);
            setMessageList((list) => [...list, data]);
            setMessage("");
        }
        if (setGiphyMessage !== "") {
            const data = {
                room,
                username,
                img: setGiphyMessage,
                time:
                    new Date(Date.now()).getHours() +
                    ":" +
                    new Date(Date.now()).getMinutes(),
            };
            await socket.emit("send-message", data);
            setMessageList((list) => [...list, data]);
            setGiphyMessage = "";
        }
    }

    const getGiphy = async () => {
        setIsLoading(true);
        try {
            const fetchData = await axios("https://api.giphy.com/v1/gifs/trending", {
                params: {
                api_key: process.env.API_KEY_GIPHY,
                limit: 100
                }
            });
            setGiphy(fetchData.data.data);
        } catch (error) {
            console.error(error)
        }
        
    }

    const handleSearchChange = event => {
        setSearch(event.target.value);
    };

    const handleSubmit = async event => {
        event.preventDefault();
        setIsLoading(true);
    
        try {
          const fetchData = await axios("https://api.giphy.com/v1/gifs/search", {
            params: {
              api_key: process.env.API_KEY_GIPHY,
              q: search,
              limit: 100
            }
          });
            setGiphy(fetchData.data.data);
        } catch (err) {
            console.log(err);
        }
    
        setIsLoading(false);
    };

    const showGiphy = () => {
        setShow(true);
        setMessage('');
        getGiphy()
        setIsLoading(false);

    }

    const sendGiphy = async  (e) => {        
        e.preventDefault();
        send();
        handleClose()
    }

    const pageSelected = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderGifs = () => {
        if (isLoading) {
            return <p>Loading...</p>;
        }
        return (
            <>
                <form className="form-inline justify-content-center m-2">
                    <input
                        value={search}
                        onChange={handleSearchChange}
                        type="text"
                        placeholder="search"
                        className="form-control"
                    />
                    <button
                        onClick={handleSubmit}
                        type="submit"
                        className="btn btn-primary mx-2"
                    >
                        Go
                    </button>
                </form>
                <Paginate 
                    pageSelected={pageSelected}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={giphy.length}
                />
                <div className="gif">
                    {currentItems.map(el => {
                        return <img 
                            key={el.id}  
                            src={el.images.fixed_height.url}
                            onClick={(event) => {
                                setGiphyMessage = event.target.currentSrc
                                sendGiphy(event)
                            }} />
                    })}
                </div>
            </>
            
        );
    };

    useEffect(() => {
        socket.on("receive-message", (data) => {
            setMessageList((list) => [...list, data]);
        })

        const fetchData = async () => {
            const result = await get({subUrl:`chat/history/${room}`});
            if (result.history && result.history.length > 0) {
                setMessageList(result.history);
            }
        }
        fetchData()
    }, [socket])

    return (
        <>
            <div className="chat-window">
                <div className="chat-header">
                    <p>Room {room}</p>
                </div>
                <div className="chat-body">
                    <div className="body-scroll">
                        {messageList.map((content) => {
                            return (
                                <div className="message"
                                    id={username === content.username ? "you" : "other"}>
                                    <div>
                                        <div className="message-content">
                                            {content.message ? <p>{content.message}</p> :  <img src={content.img} width="100px"/>}
                                        </div>
                                        <div className="message-meta">
                                            <p id="time">{content.time}</p>
                                            <p id="author">{content.username}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="chat-footer">
                    <input 
                        type="text" 
                        value={message}
                        onChange={(event) =>{
                            setMessage(event.target.value)
                        }}
                        onKeyPress={(event) => event.key === "Enter" && send()}
                        placeholder="write a message..."/>
                    <button onClick={send}>
                        <FontAwesomeIcon className="highlight" icon={faPaperPlane} />                
                    </button>
                </div>
            </div>
            {message === '/giphy'&& showGiphy()}
            <Modal
                show={show}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Giphy
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="body-modal">
                    {renderGifs()}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
        
    )
}

const Dashboard = () => {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    const [show, setShow] = useState(false);
    const joinRoom = () => {
        if (username !== "" && room !== "") {
            const data = {
                username,
                room
            }
            socket.emit("join-room", data)
            setShow(true);
        }
    };

    useEffect(() => {
               
        const token = JSON.parse(localStorage.getItem('user'));
        if(!token) {
            router.push('login')
        } else {
            const verify = async  (token) => {
                await verifyToken(token.data[1].token)
                .catch(error => {
                    console.log(error);
                    if (error && !error.data[0]) {
                        alertService.error(error.data[1], {keepAfterRouteChange: true});
                        localStorage.removeItem('user');
                        router.push('login')
                    }
                }) 
            };
            verify(token);
            setUsername(token.data[1].nickname)
        } 

    },[]);

    return (
        <>
            {!show ? (
                <div className="joinChatContainer">
                    <h3>Join A Chat</h3>
                    <input
                    type="text"
                    className="form-input"
                    placeholder="Nickname.."
                    value={username}
                    />
                    <input
                    type="text"
                    placeholder="Room ID..."
                    className="form-input"
                    onChange={(event) => {
                        setRoom(event.target.value);
                    }}
                    />
                    <button onClick={joinRoom}>Join A Room</button>
                </div>
            ): <Chat socket={socket} username={username} room={room} />}
            
        </>  
    );
}

export default Dashboard;