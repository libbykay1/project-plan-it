import { useState, useEffect } from "react";
import { useAuthContext } from "@galvanize-inc/jwtdown-for-react";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import jwtDecode from "jwt-decode";


function ProjectDetails(props){


    const {token} = useAuthContext()
    const {project_id} = useParams()
    const [project, setProject] = useState([])
    const [account, setAccount] = useState([])

    const decodedToken = jwtDecode(token)

    const accountId = decodedToken.account.id


    console.log("account:", props.account)

    const fetchProjectDetails = async () => {
        const projectUrl = `${process.env.REACT_APP_API_HOST}/api/projects/${project_id}`
        const fetchConfig = {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }

        try {
            const response = await fetch(projectUrl, fetchConfig)
            if (response.ok) {
                const project = await response.json()
                setProject(project)
                console.log(project)
            }
        } catch (error) {
            console.error("Error fetching project details:", error)
        }
    }

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

    const handleJoinProject = async () => {
        const joinUrl = `${process.env.REACT_APP_API_HOST}/api/attendees`
        const data = {
            project_id: project_id,
            account_id: accountId
        }

        const fetchConfig = {
            method: "post",
            body: JSON.stringify(data),
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }

        try {
            const response = await fetch(joinUrl, fetchConfig)
            if (response.ok){
                alert("You have successfully joined the project!")
            } else {
                alert("Error joining the project.  Please try again later.")
            }
        } catch (error){
            console.error("Error joining the project:", error)
            alert("An error occurred while attempting to join the project.")
        }
    }

    useEffect(() => {
        fetchProjectDetails();
        fetchAccountData()
    }, []);

    if(!project) {
        return <div>Loading...</div>
    }

    return (
        <div className="row">
            <div className="col-lg 6">
                <img src={project.project_picture} alt="project_picture" />
            </div>
            <div className="col-lg 6">
                <h2>{project.project_name}</h2>
                <p>{project.goal}</p>
                <div className="form-floating mb-3 text-center">
                <button
                    onClick={handleJoinProject}
                    className="btn btn-primary"
                    style={{ backgroundColor: 'green', marginRight: '10px' }}
                    > Join Project
                </button>
            </div>
            </div>
        </div>
    )

}

export default ProjectDetails
