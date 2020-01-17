import React, {useEffect, useState} from 'react';
import {StyleSheet, Image, View, Text, TextInput, TouchableOpacity, Keyboard} from 'react-native';
import MapView, {Marker, Callout} from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';


import api from '../services/api';

function Main({navigation}){
    const [currentRegion, setCurrentRegion] = useState(null);
    const [devs, setDevs] = useState([]);
    const [techs, setTechs] = useState('');

    useEffect(()=>{
        async function loadInitialPosition(){
            const {granted} = await requestPermissionsAsync();


            if(granted){
                const {coords} = await getCurrentPositionAsync({
                    enableHighAccuracy:false,

                });
                const {latitude, longitude} = coords;

                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta:0.04,
                    longitudeDelta: 0.04,
                });
                
            }
        }

        loadInitialPosition();
    },[]);

    async function loadDevs(){
        const {latitude, longitude} = currentRegion;

        const response = await api.get('/search', {
            params: {
                longitude,
                latitude,
                techs
            }
        });
        console.log(response.data.devs);
        setDevs(response.data.devs);
    }
    function handleRegionChanged(region){
        //console.log(region);
        setCurrentRegion(region);

    }

    if(!currentRegion){
        return null;
    }
    //-15.9017787,-48.048084,17.22z
    return (
        <>
            <MapView 
                onRegionChangeComplete={handleRegionChanged} 
                initialRegion={currentRegion} 
                style={styles.map}
            >
                {devs.map(dev=>(

                    <Marker key={dev._id} coordinate={{latitude: dev.location.coordinate[1], longitude: dev.location.coordinate[0]}} >
                        <Image style={styles.avatar} 
                            source={{uri: dev.avatar_url}}
                        />
                        <Callout onPress={()=>{
                            navigation.navigate('Profile', {githubUsername: dev.github_username});
                        }}>
                            <View style={styles.callout}>
                                <Text style={styles.devName}>{dev.name}</Text>
                                <Text style={styles.devBio}>{dev.bio}</Text>
                                <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>
            <View style={styles.searchForm}>
                <TextInput 
                    onChangeText={setTechs}
                    style={styles.serchInput}
                    placeholder = "Buscar por techs..."
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                    autoCorrect={false}
                />
                <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
                    <MaterialIcons name='my-location' size={20} color="#fff"/>
                </TouchableOpacity>
                    
                
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    map:{
        flex: 1
    },

    avatar:{
        width:54,
        height: 54,
        borderRadius:4,
        borderWidth: 4,
        borderColor: '#FFF',
    },

    callout:{
        width: 260
    },

    devName:{
        fontWeight: 'bold',
        fontSize: 16,
    },

    devBio:{
        color: "#777",
        marginTop:5

    },

    devTechs:{
        marginTop: 5,
    },
    searchForm:{
        position:"absolute",
        top: 20,
        left: 20,
        right:20,
        zIndex: 5,
        flexDirection: "row",
    },


    serchInput:{
        flex:1,
        height: 50,
        backgroundColor: "#fff",
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor:'#000',
        shadowOpacity: 0.2,
        shadowOffset:{
            width:4,
            height: 4,
        },
        elevation: 2,

    },

    loadButton:{
        width:50,
        height:50,
        backgroundColor: '#8E4Dff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft:15

    }
});

export default Main;