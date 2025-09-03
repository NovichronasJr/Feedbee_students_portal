
import Link from "next/link"
import { useState,useEffect } from "react"
import {UserButton} from '@clerk/nextjs'
import {useUser} from '@clerk/clerk-react'
import axios from "axios"
export default function Navbar(){
    const {user} = useUser();
    
    const [name,setName] = useState("");
    const [id,setId] = useState("");
    useEffect(()=>{
        async function getId(){
            try{
                const email = await user.emailAddresses[0]?.emailAddress
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/student/${email}`);
            console.log("navbar response : ",response.data);
            console.log("student id : ",response.data.student[0]._id)
            setId(response.data.student[0]._id);
            }catch(error){
                console.log(error.message);
            }
        }
        async function GetName(){
            console.log(user.fullName);
            setName(user.fullName);
        }
        GetName()
        getId();
    },[user])

    const [show,setShow] = useState(false)

    function DisplayBlock(){
        if(show===true)
        {
            setShow(false)
            
        }
        else{
            setShow(true) 
        }
        }


    return (
    
    <nav className="bg-zinc-900">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            
                <button type="button" className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset" aria-controls="mobile-menu" aria-expanded="false">
                <span className="absolute -inset-0.5"></span>
                <span className="sr-only">Open main menu</span>

                <svg className="block size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                <svg className="hidden size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                </button>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex shrink-0 items-center font-bold text-fuchsia-600 text-xl">
                FeedBee
                </div>
                <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">

                    <Link href="/" className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white" aria-current="page">Dashboard</Link>
                    <Link href={`/feedbackdata/${id}`} className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 hover:text-white">Feedbacks</Link>
                    <Link href={`/comment/${id}`} className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 hover:text-white">Comments</Link>
                </div>
                </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button type="button" className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                <span className="absolute -inset-1.5"></span>
                <span className="sr-only">View notifications</span>
                <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
                </button>
                <div className="relative ml-3 flex flex-row item-center gap-4 justify-center">
                <UserButton />
                {name &&<h2>{name}</h2>}
                </div>
            </div>
            </div>
        </div>

        
        <div className="sm:hidden" id="mobile-menu">
            <div className="space-y-1 px-2 pt-2 pb-3">
            
            <Link href="#" className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white" aria-current="page">Dashboard</Link>
            <Link href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Feedbacks</Link>
            </div>
        </div>
    </nav>

    
    )
}