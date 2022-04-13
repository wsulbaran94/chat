import App from 'next/app'

import 'bootstrap/dist/css/bootstrap.min.css'
import Alert  from '../components/shared/Alert';
import NavBar from '../components/shared/Navbar';
import '../styles/index.scss';

const MyApp = ({Component, pageProps}) => {
    console.log('Component', Component.name);

    const isDashboardPage = () => Component.name === 'Dashboard';

    return (
        <div className='container-app'>
            {isDashboardPage() && <NavBar/>}
            <div className='alert-space'>
                <Alert />
            </div>
            <div className='container'>
                <Component {...pageProps}/>
            </div>
        </div>
    )
}

export default MyApp;