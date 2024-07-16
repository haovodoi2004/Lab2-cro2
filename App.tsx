/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  Alert,
  Button,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Item from './component/item';

export default function App() {
  const [data, setdata] = useState([])
  const [add, setadd] = useState(false)
  const [titlee,settitle]=useState('')
  const [contentt,setcontent]=useState('')
  const [statuss,setstatus]=useState(0)
  const [update,setupdate]=useState(false)
  const [select,setselect]=useState(null)
  const [statusCounts, setStatusCounts] = useState({ status0: 0, status1: 0 });

  const calculateStatusCounts = (data) => {
    const status0 = data.filter(item => item.status === 0).length;
    const status1 = data.filter(item => item.status === 1).length;
    setStatusCounts({ status0, status1 });
  };

  const getapi = async () => {
    try {
      const res = await fetch('http://192.168.2.3:80/product')
      const data = await res.json()
      setdata(data);
      calculateStatusCounts(data);
    } catch (error) {
      console.log("co loi khi lay du lieu tu api " + error);
    }
  }
  useEffect(() => {
    getapi();
   
  }, [data]);
  const render = ({ item }) => {
    return (
      <View style={{borderWidth:1,width:'90%',alignSelf:'center',borderRadius:10,marginTop:10}}>
        <Text>Tieu de: {item.title}</Text>
        <Text>Noi dung: {item.content}</Text>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
        <Text>Trang thai: {item.status === 1 ? 'đã xong' : 'chưa hoàn thành'}</Text>
        <Text style={{marginRight:'10%',color:'#FF0000'}} onPress={()=>openupdate(item)}>Sửa</Text>
          </View>
        <View>
          <Button title='xoa' onPress={()=>xoa(item)}/>
        </View>
      </View>
    )
  }

  const openupdate=(item)=>{
    setupdate(true)
    setcontent(item.content)
    settitle(item.title)
    setstatus(item.status)
    setselect(item)
  }
  
  const themorsua=()=>{

    const ob = {
      title: titlee,
      content:contentt,
      status:statuss
    };
    let method='POST';
    let url='http://192.168.2.3:80/product'
    if(update==true){
      method='PUT';
      url=`http://192.168.2.3:80/product/${select.id}`
    }
    fetch(url, {
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ob),
    }).then(()=>{
      setupdate(false)
      settitle('')
      setcontent('')
      setstatus(0)
    }).catch((error)=>{
      console.error('Lỗi khi lưu dữ liệu nhân viên:', error);
    });
  }

  const xoa=(item)=>{
    Alert.alert(`xóa công việc`,`Bạn có muốn xóa công việc ${item.title}`,[
      {
        text: 'ok',
      onPress:()=>{
        fetch(`http://192.168.2.3:80/product/${item.id}`, {
          method: 'DELETE',
        }).then((res)=>{
          if(res.status==200){
            Alert.alert('bạn đã xóa thành công');
          }else{
            Alert.alert('xóa thất bại')
          }
        });
      }
      },
      {
        text:'hủy',
        style:'cancel'
      }
    ])
   
  }
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Text style={st.tx}>Danh sach cong viec</Text>
        <FlatList
          renderItem={render}
          data={data} />
      </View>

      <View >
      <Text>So cong viec hoan thanh: {statusCounts.status1}</Text>
      <Text>So cong viec chua hoan thanh: {statusCounts.status0}</Text>
        <Button title='Them' onPress={() => setadd(true)} />
      </View>
      <Modal visible={add == true}>
        <Text style={st.tx1}>Thêm công việc</Text>
        <Text>Title:</Text>
        <TextInput style={st.tip} value={titlee} onChangeText={(text)=>settitle(text)}/>
        <Text>Content:</Text>
        <TextInput style={st.tip} value={contentt} onChangeText={(text)=>setcontent(text)}/>
        <Text>Status:</Text>
        <TextInput style={st.tip} value={statuss.toString()} onChangeText={(text)=>setstatus(parseFloat(text))}/>
        <View style={{ width: '75%', alignSelf: 'center', marginTop: 10 }}>
          <Button title='Thêm' onPress={themorsua}/>
        </View>
        <View style={{ width: '75%', alignSelf: 'center', padding: 0, marginTop: 10 }}>
          <Button title='Hủy' onPress={()=>setadd(false)}/>
        </View>
      </Modal>

      <Modal visible={update == true}>
        <Text style={st.tx1}>Sua công việc</Text>
        <Text>Title:</Text>
        <TextInput style={st.tip} value={titlee} onChangeText={(text)=>settitle(text)}/>
        <Text>Content:</Text>
        <TextInput style={st.tip} value={contentt} onChangeText={(text)=>setcontent(text)}/>
        <Text>Status:</Text>
        <TextInput style={st.tip} value={statuss.toString()} onChangeText={(text)=>setstatus(parseFloat(text))}/>
        <View style={{ width: '75%', alignSelf: 'center', marginTop: 10 }}>
          <Button title='Thêm' onPress={themorsua}/>
        </View>
        <View style={{ width: '75%', alignSelf: 'center', padding: 0, marginTop: 10 }}>
          <Button title='Hủy' onPress={()=>setupdate(false)}/>
        </View>
      </Modal>
      

    </View>

  )
}


const st = StyleSheet.create(
  {
    tx: {
      fontSize: 25, textAlign: 'center'
    }, tip: {
      borderWidth: 1, borderRadius: 10, width: '90%', alignSelf: 'center'
    }, tx1: {
      fontSize: 25, color: '#FF0000', textAlign: 'center', fontStyle: 'normal',
      fontFamily: 'Times New Roman'
    }
  }
)