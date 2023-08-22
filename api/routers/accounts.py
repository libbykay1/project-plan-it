from fastapi import (
    Depends,
    HTTPException,
    status,
    Response,
    APIRouter,
    Request,
)
from queries.accounts import (
    AccountIn,
    AccountOut,
    AccountRepo,
    AccountRepository,
    Error,
    DuplicateAccountError,
)
from jwtdown_fastapi.authentication import Token
from pydantic import BaseModel
from authenticator import authenticator
from queries.accounts import AccountIn, AccountOut, AccountRepository, Error
from typing import Union, List, Optional

router = APIRouter()


@router.get("/api/accounts", response_model=Union[List[AccountOut], Error])
def get_all_accounts(
    repo: AccountRepository = Depends(),
):
    return repo.get_all_accounts()


@router.put(
    "/api/accounts/{account_id}", response_model=Union[AccountOut, Error]
)
def update_account(
    account_id: int,
    account: AccountIn,
    repo: AccountRepository = Depends(),
) -> Union[Error, AccountOut]:
    return repo.update_account(account_id, account)


@router.delete("/api/accounts/{account_id}", response_model=bool)
def delete_account(
    account_id=int,
    repo: AccountRepository = Depends(),
) -> bool:
    return repo.delete_account(account_id)


@router.get("/api/accounts/{account_id}", response_model=Optional[AccountOut])
def get_account(
    account_id: int,
    response: Response,
    repo: AccountRepository = Depends(),
) -> AccountOut:
    account = repo.get_account(account_id)
    if account is None:
        response.status_code = 404
        return None

    return account


class AccountForm(BaseModel):
    username: str
    password: str


class AccountToken(Token):
    account: AccountOut


class HttpError(BaseModel):
    detail: str


@router.post("/api/accounts", response_model=AccountToken | HttpError)
async def create_account(
    info: AccountIn,
    request: Request,
    response: Response,
    repo: AccountRepo = Depends(),
):
    hashed_password = authenticator.hash_password(info.password)
    try:
        account = repo.create(info, hashed_password)
    except DuplicateAccountError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot create an account with those credentials",
        )
    form = AccountForm(username=info.email, password=info.password)
    token = await authenticator.login(response, request, form, repo)
    return AccountToken(account=account, **token.dict())
