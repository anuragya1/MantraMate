import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useAuth } from './Auth/UserAuthProvider';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../App';
import { useNavigation } from '@react-navigation/native';
type prop=StackNavigationProp<StackParamList,'OTP'>
const Profile2 = () => {
  const [isEditing, setIsEditing] = useState(false);
  const[profileImage,setProfileImage]=useState<string|null|undefined>('')
  const navigation=useNavigation<prop>()
  const {user}=useAuth()
     useEffect(()=>{
         const a=async()=>{
              const image=user?.profileImage;
            setProfileImage(image)
            console.log("in Profile ",profileImage)
         }
         a();
     },[])
  const handleEditPress = () => {
    setIsEditing(true);
  };

  const handleSavePress = () => {
    navigation.navigate('Category')
    setIsEditing(false);
   
  };

  return (
    <SafeAreaView style={styles.container}>
    
      <Image
        source={{
          uri: 'https://s3-alpha-sig.figma.com/img/8995/10f6/5efd349079a91edc875a4766c9f16ae8?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Fd-UHyBxHgKqTau-cGaCiGmHdXN8ulsa3Q1NzLPOiFEzWS-vae-99Ntu4PU~TvpqIX5ac4kBU5gFRyT~gQeaKclTP1dXk4KMmQAbUbrs56cZFNSeMW2to9lx8XJuUjAkkUpxQGL42J0mWPgmtdUIZgSmllQI3fb~VL5VkO9TMlzoGgGps-Z~a4rUN3TGIlIfTFZGBV99t4XKODMrcXWEJgoKQRxernto1FKh36-df4ecm5XkGDPZViBrIfPaz1cFxEOPQjDIKNYSyJ8HIGBLBakYhtt9WDucy4tC~BSAJ7SM1K09xZVvxOoylLKvyc~JbepN2ottFixRytIsjaJJgw__',
        }}
        style={styles.backgroundPattern}
      />

      <Text style={styles.headerText}>Your Profile</Text>

      <Image
        source={{
          uri: profileImage||'https://s3-alpha-sig.figma.com/img/3b4a/d73b/b44e8d200d35ff83994d863d6f4ff3ad?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=OJkKUltckUxGQVADwFuamGprMx~NqiXzXnsqHMrMFI5d0OnNpvqmfKdn0KdJUiuoUop-LVsB2ct8CrBD-6itPWWZyMU3ydiPuRPuW8YzVUNPOFEhq2AbIjK90HpsNp-7qVy4FjUssURACscOn4tr-bEn7jRJusQzVEtQOidJaTO52f19fSUDdi5Vr3-dXhjlKvRxTAFpMO7aud1N9r26uHifi6BoFa0LDkEjYMbBBlVEFqZcz5UfmX6PDh2rPYGk4QqQYKiWFMe2mdRSB1lOlAhLas3Lsh2ZpkI0sF8uc7uA~UjYGniee9soEiqTlx6Ou7DtbCFJkIbh0k4rk8aM4g__',
        }}
        style={styles.profileImage}
      />


      <View style={styles.firstNameContainer}>
        <Text style={styles.label}>First name</Text>
        <TextInput
          style={styles.input}
          placeholder={user?.firstName}
          placeholderTextColor="#999"
          editable={isEditing}
        />
      </View>

      <View style={styles.lastNameContainer}>
        <Text style={styles.label}>Last name</Text>
        <TextInput
          style={styles.input}
          placeholder={user?.lastName}
          placeholderTextColor="#999"
          editable={isEditing}
        />
      </View>

      <View style={styles.emailContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Value"
          placeholderTextColor="black"
          editable={isEditing}
          keyboardType="email-address"
        />
      </View>

  
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEditPress}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleSavePress}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundPattern: {
    position: 'absolute',
    width: 621,
    height: 869,
    top: 243,
    left: 33,
    opacity: 0.1,
  },
  headerText: {
    position: 'absolute',
    width: 105,
    height: 28,
    top: 73,
    left: 142,
    fontSize: 18,
    fontWeight: '600',
    borderRadius: 10,
  },
  profileImage: {
    position: 'absolute',
    width: 111,
    height: 111,
    top: 127,
    left: 136,
    borderRadius: 55.5,
  },
  firstNameContainer: {
    position: 'absolute',
    width: 320,
    height: 70,
    top: 278,
    left: 28,
  },
  lastNameContainer: {
    position: 'absolute',
    width: 320,
    height: 70,
    top: 366,
    left: 28,
  },
  emailContainer: {
    position: 'absolute',
    width: 320,
    height: 70,
    top: 454,
    left: 28,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FFF',
    color:'black'
  },
  buttonContainer: {
    position: 'absolute',
    width: 320,
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: 559,
    left: 28,
  },
  editButton: {
    width: '45%',
    height: 40,
    backgroundColor: '#3B5BBF', 
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    width: '45%',
    height: 40,
    backgroundColor: '#FF0000', 
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Profile2;
