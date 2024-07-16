import { Text, View } from "react-native";

export default function Item({title,content,status}){
    return(
        <View>
            <Text>Tieu de: {title}</Text>
            <Text>Noi dung: {content}</Text>
            <Text>Trang thai: {status}</Text>
        </View>
    )
}