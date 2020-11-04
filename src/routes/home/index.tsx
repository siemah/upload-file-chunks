import { FunctionalComponent, h, } from "preact";
import { useState } from "preact/hooks";
import * as style from "./style.css";

const MAX_FILE_CHUNK_SIZE = 100000; // 100Kb
const Home: FunctionalComponent = () => {
    const [progress, setProgress] = useState<string>('0');
    const [file, setFile] = useState<File>(null!);
    const onChange = (evnt: any) => {
        const { files } = evnt.target;
        if (files?.length) {
            setFile(files[0]);
        }
    }

    const onUpload = async (evnt: any) => {
        evnt.preventDefault();
        let i = 0;
        let chunkSize = MAX_FILE_CHUNK_SIZE;
        let isDone = false;
        if (file?.size > MAX_FILE_CHUNK_SIZE) {
            while (!isDone) {
                let startSlice = i * MAX_FILE_CHUNK_SIZE;
                let endSlice = (i + 1) * MAX_FILE_CHUNK_SIZE;
                if (file?.size - (i * MAX_FILE_CHUNK_SIZE) > MAX_FILE_CHUNK_SIZE) {
                    chunkSize = i * MAX_FILE_CHUNK_SIZE;
                } else {
                    chunkSize = file?.size - (i * MAX_FILE_CHUNK_SIZE);
                    endSlice = file?.size;
                    isDone = true;
                    console.log('[[[[[[[end of uploading]]]]]]]', chunkSize)
                }
                const blobFile = file.slice(startSlice, endSlice, file?.type);
                const formData = new FormData();
                const headers = new Headers();
                // todo: newSize = size - (chuckSize)
                formData.append('file', 'blobFile');
                headers.append("X-File-Start", startSlice.toString());
                headers.append("X-File-Name", file.name);
                // headers.append("Content-Type", 'application/json');

                const res = await fetch('http://localhost:3001/up', {
                    method: 'POST',
                    body: blobFile,
                    headers
                });
                let data = await res.json();
                console.log(data);
                if(data.status === 'success') {
                    console.log(`${i}:/- from ${startSlice} to ${endSlice} of ${file.size}`, chunkSize, isDone)
                    setProgress((endSlice/file.size * 100).toFixed(2));
                }
                i++;
            }
        } else {
            // TODO: upload file directly without any slicing
        }
    }

    return (
        <div class={style.home}>
            <h1>Home</h1>
            <p>This is the Home component.</p>
            <input type='file' onChange={onChange} name='file' />
            <button onClick={onUpload}>upload</button>
            <progress max={100} value={progress} >
            {progress}%
            </progress>
        </div>
    );
};

export default Home;
