import { Button, Card } from "flowbite-react";
import { toast } from "react-toastify";

export default function Dashboard() {
    const handleShowToast = () => {
        toast.success('Thành công')
    }
    return(
        <div>
            <Card>
                <Button gradientDuoTone={"greenToBlue"} onClick={handleShowToast} size={"xs"}>Submit</Button>
            </Card>
        </div>
    )
}