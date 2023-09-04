import { useAuthContext } from "@galvanize-inc/jwtdown-for-react";
import "./App.css";
import SignupForm from "./Account/SignUpForm";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginForm from "./Account/LoginForm";
import ProjectForm from "./Project/ProjectForm";
import ProjectList from "./Project/ProjectList";
import ProjectDetails from "./Project/ProjectDetails";
import React, { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";


function App() {

	const [account, setAccount] = useState([])
	const {token} = useAuthContext()



	const fetchAccountData = async () => {
        const accountUrl = `${process.env.REACT_APP_API_HOST}/api/accounts`
        const fetchConfig = {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
        try {
            const response = await fetch(accountUrl, fetchConfig)
            if(response.ok) {
                const data = await response.json()
                setAccount(data)

                const decodedToken = jwtDecode(token)
				console.log(decodedToken)
            }
        } catch (error) {
            console.error("Error fetching account details:", error)
        }
    }

	useEffect(() => {
		fetchAccountData()
	}, [])

	return (
		<div>
			<BrowserRouter>
				{/* <AuthProvider baseUrl={process.env.REACT_APP_API_HOST}> */}
					<Routes>
						<Route path='/signup' element={<SignupForm />}></Route>
						<Route path='/login' element={<LoginForm />}></Route>
						<Route path="/projects/new" element={<ProjectForm account={account}/>}></Route>
						<Route path="/projects" element={<ProjectList account={account}/>}></Route>
						<Route path="/project-details/:project_id/" element={<ProjectDetails account={account} />}></Route>
					</Routes>
				{/* </AuthProvider> */}
			</BrowserRouter>
		</div>
	);
}

export default App;
