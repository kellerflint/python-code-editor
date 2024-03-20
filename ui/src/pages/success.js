import useAuth from "../auth/useAuth";

function Success() {

    const session = useAuth();

    return (
        <div>
            <h1>Success {session?.user?.email}</h1>
        </div>
    );
}

export default Success;