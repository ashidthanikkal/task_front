import { base_url } from "./baseUrl"
import { commonStructure } from "./commonApis"

export const addTask=async(body)=>{
    return await commonStructure('POST',`${base_url}/task`,body)
}


export const viewTask=async()=>{
    return await commonStructure('GET',`${base_url}/task`,{})
}

export const deleteTask=async(id)=>{
    return await commonStructure('DELETE',`${base_url}/task/${id}`,{})
}


export const editTask = async (id, body) => {
    return await commonStructure('PUT', `${base_url}/task/${id}`, body);
};

