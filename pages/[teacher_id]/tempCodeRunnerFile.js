import { useRouter } from "next/router"
import { useEffect,useState } from "react"

export default function TeacherPage(){
    const router = useRouter()
    const [teacher_id,setTeacher_id] = useState("")
    useEffect(()=>{
        setTeacher_id(router.query.teacher_id);
    },[router.query])

    return (
        <>
            <h1 className="text-white text-2xl">This is teachers page</h1>
            <h1 className="text-2xl text-white">Teacher id is {teacher_id}</h1>
        </>
    )
}