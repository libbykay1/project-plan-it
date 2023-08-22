from fastapi import APIRouter, Depends, HTTPException
from typing import Union, Optional, List
from queries.projects import (
    ProjectIn,
    ProjectRepository,
    ProjectOut,
    Error,
    ProjectQueries,
)

router = APIRouter()


@router.post("/api/projects", response_model=Union[ProjectOut, Error])
def create_project(
        project: ProjectIn,
        repo: ProjectRepository = Depends(),
):
    try:
        created_project = repo.create(project)
        return created_project
    except Exception as e:
        error_message = "An error occurred while processing the request."
        return Error(message=error_message)


@router.delete("/api/projects/{project_id}", response_model=bool)
def delete_project(
    project_id: int,
    repo: ProjectRepository = Depends(),
) -> bool:
    return repo.delete(project_id)


@router.get("/api/projects", response_model=List[ProjectOut])
def get_all_projects(queries: ProjectQueries = Depends()):
    return queries.get_all_projects()


@router.get("/api/projects/{project_id}", response_model=Optional[ProjectOut])
def get_project(project_id: int, queries: ProjectQueries = Depends()):
    project = queries.get_project(project_id)
    if project is None:
        raise HTTPException(
            status_code=404, detail=f"No project found with id {project_id}")
    return project


@router.put("/api/projects/{project_id}", response_model=ProjectOut)
def update_project(project_id: int, data: ProjectIn, queries: ProjectQueries = Depends()):
    existing_project = queries.get_project(project_id)
    if existing_project is None:
        raise HTTPException(
            status_code=404, detail=f"No project found with id {project_id}")

    queries.update_project(project_id, data)
    return queries.get_project(project_id)