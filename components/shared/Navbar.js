import { useRouter } from "next/router";
import { Navbar, Nav } from "react-bootstrap";
import Link from "next/link";

const AppLink = ({children, className, handle}) => 
	<button className={className} onClick={handle}>{children}</button>	

const AppLink2 = ({children, className, href}) => 
	<Link href={href}>
		<a className={className}>{children}</a>
	</Link>

const NavBar = () => {
	const router = useRouter()
	const handleLogout = () => {
		
		if (window !== undefined) {
			localStorage.removeItem('user');
			router.push('login')
		}
	}

    return (
		<div className="navbar-wrapper">
			<Navbar expand="lg" className=" navbar-dark fj-mw9">
				Tecnical-Test-IRC
				<AppLink2
					href="#" 
					className="navbar-brand mr-3 font-weight-bold">
					Tecnical-Test-IRC
				</AppLink2>
				<Navbar.Toggle />
				<Navbar.Collapse>
					<Nav className="left">
						<AppLink className="mr-3 btn btn-danger bg-red-2 bright"
							children={'Sign Out'} handle={handleLogout}>
						</AppLink>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
	  	</div>
    )
}

export default NavBar;