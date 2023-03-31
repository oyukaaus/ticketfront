import { toast } from "react-toastify";

export default (message, success, options = {}) => {
    if (message) {
        if (success) {
            toast.success(message, {
                position: "top-right",
                autoClose: 6000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                ...options
            });
        } else {
            toast.error(message, {
                position: "top-right",
                autoClose: 6000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                ...options
            });
        }
    }
}