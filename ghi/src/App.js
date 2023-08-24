import { useEffect, useState } from "react";
import { AuthProvider } from "@galvanize-inc/jwtdown-for-react";
import "./App.css";
import SignupForm from "./SignUpForm";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginForm from "./LoginForm";
import Nav from "./nav";

function App() {
	return (
		<div>
			<BrowserRouter>
				<AuthProvider baseUrl={process.env.REACT_APP_API_HOST}>
					<Nav />
					<Routes>
						<Route path='/signup' element={<SignupForm />}></Route>
						<Route path='/login' element={<LoginForm />}></Route>
					</Routes>
				</AuthProvider>
			</BrowserRouter>
		</div>
	);
}

export default App;
