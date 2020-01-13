import React, {useCallback, useEffect, useRef, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {TextField, Button, Container, FormGroup} from "@material-ui/core"
import {useEffectOnChange} from "./useEffectOnChange";
import {renderImg} from "./renderImg";

function App() {


    const [loginInfo, setLoginInfo] = useState({
        id:'',
        pass:'',
        isLogin:false,
    });
    const [params, setParams] = useState({
        seed:"",
        radius:"",
    });

    const [mess, setMess] = useState("");
    const [img, setImg] = useState([]);

    const canvasRef = useRef(null);
    useEffectOnChange(()=>{
        if(img && canvasRef.current){
            setMess("");
            console.log(img);
            // renderImg(JSON.parse(img), canvasRef.current, params.radius)
        }
    },[img]);


    const [ws, setWs] = useState(null);

    const onMess = useCallback((e)=>{
        const data = JSON.parse(e.data)

        switch (data.type) {
            case "USER_CREATED" : {
                setLoginInfo({
                    ...loginInfo,
                    isLogin: true
                });
                setMess("Подключение установлено, установите данные для генерации карты");
                break
            }
            case "USER_DELETED" : {
                setLoginInfo({
                    ...loginInfo,
                    isLogin: false
                });
                break
            }
            case "SET_IMG" : {
                setImg(data.body);
                break
            }
            default : {

            }
        }


    }, [loginInfo]);

    const createWs = useCallback(()=>{

        if(ws !== null){
            ws.close();
        }
        console.log("webSocket")
        const localWs = new WebSocket('ws://localhost:4000/client/');

        localWs.onopen = () => {
            setWs(localWs);
            localWs.onmessage = onMess;
        }
    }, [onMess]);

    useEffect(()=>{
        setLoginInfo({
            ...loginInfo,
            isLogin:false,
        });
        if(ws !== null){
            setMess("Ждём подключения");
            ws.send(JSON.stringify({
                type:"CREATE",
                id:loginInfo.id,
                pass:loginInfo.pass,
            }));
        }
    },[ws]);

    useEffect(()=>{
        if(
            params.radius &&
            params.seed &&
            !isNaN(Number(params.radius)) &&
            !isNaN(Number(params.seed))
        ){
            console.log('seend')
            ws.send(JSON.stringify({
                type:"SET_PARAMS",
                body: params
            }))
        }
    }, [params]);




  return (
    <div className="App">
      <div className="App__wrapper">
        <div className="App__left-menu">
            <FormGroup>
            <TextField
                label={'id'}
                value={loginInfo.id}
                onChange={(e) => {
                    setLoginInfo({
                        ...loginInfo,
                        id:e.target.value
                    })
                }}
            />
            <TextField
                label={"pass"}
                value={loginInfo.pass}
                onChange={(e) => {
                    setLoginInfo({
                        ...loginInfo,
                        pass:e.target.value
                    })
                }}
            />
                <Button
                    onClick={createWs}
                    style={{marginTop:"16px"}}>
                    Отправить
                </Button>
            </FormGroup>

            {loginInfo.isLogin && <FormGroup style={{marginTop:"15px"}}>
                <hr/>
                <h3> Параметры генерации </h3>
                <TextField
                    label={"seed"}
                    value={params.seed}
                    onChange={(e) => {
                        setParams({
                            ...params,
                            seed:e.target.value
                        })
                    }}
                >

                </TextField>
                <TextField
                    label={"radius в блоках"}
                    value={params.radius}
                    onChange={(e) => {
                        setParams({
                            ...params,
                            radius:e.target.value
                        })
                    }}
                >

                </TextField>
            </FormGroup>}



        </div>
        <div className="App__main">
          <div className="App__img-wrapper">
            <div className="App__img">
                {img ? <canvas ref={canvasRef} />:null}
                { mess ? (
                    <div className="App__mess-wrapper">
                        <div className='App__mess' >
                            {mess}
                        </div>
                    </div>
                ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
