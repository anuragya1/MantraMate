import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,SafeAreaView,TextInput,
  Dimensions
} from 'react-native';
import { useAuth } from './Auth/UserAuthProvider';
import * as DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import  Icon  from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../App';
import { BASE_URL, GENERATE_PRESIGNED_URL, GET_PRESIGNED_URL, PANDIT_URL } from '../config/Env';
const { width, height } = Dimensions.get('window');
type prop =StackNavigationProp<StackParamList,'ProfileScreen'>
const ProfileScreen = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileUImage, setProfileUImage] = useState<string | null>(null);
    const {setUserData}=useAuth();
const navigation=useNavigation<prop>()
  const uploadImage = async (imageUri: string) => {
    try {
   
      const timestamp = Date.now();
      const fileExtension = 'jpg'; 
      const fileName = `profile_${timestamp}.${fileExtension}`;
      const presignedUrlResponse = await axios.get(
        `${GENERATE_PRESIGNED_URL}`,
        {
          params: {
            file_name: fileName, 
          },
        }
      );
  
      console.log('Presigned URL Response:', presignedUrlResponse.data); 
  
      const { presigned_url } = presignedUrlResponse.data.results;
  
      
      const uploadResponse = await fetch(presigned_url, {
        method: 'put',
        body: {
          uri: imageUri, 
          type: 'image/jpeg',
          name: fileName, 
        },
        headers: {
          'Content-Type': 'image/jpeg', 
        },
      });
  
     
      if (!uploadResponse.ok) {
        throw new Error('Upload to S3 failed');
      }
  

      const finalUrlResponse = await axios.get(
        `${GET_PRESIGNED_URL}`,
        {
          params: {
            url: presigned_url, 
          },
        }
      ); 
      console.log("final image response ",finalUrlResponse )

  
      const finalImageUrl = finalUrlResponse.data.results; 
      Alert.alert('Image uploaded successfully');
      return finalImageUrl; 
  
    } catch (error: any) {
      console.log('Full error details:', error.response || error); 
      Alert.alert('Error uploading image: ' + (error.response?.data?.message || error.message));
      throw error;
    }
  };
  
  
  const handleImagePick = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        copyTo: 'cachesDirectory', 
      });
  
      if (result.length > 0) {
        const fileDetails = result[0];
 
        const imageUri = fileDetails.fileCopyUri || fileDetails.uri;
       
        
        console.log("Selected file details:", fileDetails);
        
        const imageUrl = await uploadImage(imageUri);
       const finalUrl=imageUrl.presigned_url;
       const trimmedUrl = finalUrl.split('?')[0]; 
        
        if (imageUrl) {
          setProfileImage(trimmedUrl);
          setProfileUImage(finalUrl)
          await AsyncStorage.setItem('ProfileImage',imageUrl.presigned_url );
          console.log('Final Image URL:', imageUrl.presigned_url,"and the profileurl is ",profileImage); 
       
        }
      }
    } catch (error: any) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User cancelled the picker');
        Alert.alert('Image selection was cancelled.');
      } else {
        console.error('DocumentPicker Error: ', error);
        Alert.alert('Error picking image: ' + error.message);
      }
    }
  };
  
  const handleSave = async () => {
    console.log("Save button clicked");
    if (!firstName || !lastName || !contactNumber) {
      Alert.alert('Please fill in all fields');
      return;
    }

    const data = {
      first_name: firstName,
      last_name: lastName,
      contact_number: contactNumber,
      profile_image: profileImage,
    };

    try {
      const accessToken = await AsyncStorage.getItem('refreshToken');;
      const userData=await  AsyncStorage.getItem('userData');
      console.log(accessToken,"  ",userData)
      const User= userData ? JSON.parse(userData) : null
      console.log(userData)
      console.log(data)
      const response = await axios.patch(`${PANDIT_URL}/${User.user_id}`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        Alert.alert('Profile updated successfully');
        const userDataToUpdate = {
          id: User.user_id,
          name: User.name,
          contactNumber: contactNumber,
          firstName: firstName,
          lastName: lastName,
          profileImage: profileUImage,
        };
  
        setUserData(userDataToUpdate);
        navigation.navigate('Profile2')
      } else {
        Alert.alert('Failed to update profile');
      }
    } catch (error: any) {
      console.log('Error updating profile:', error.response ? error.response.data : error);
      Alert.alert('Error updating profile');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Your Profile</Text>

      <View style={styles.profileImageContainer}>
        <TouchableOpacity onPress={handleImagePick}>
          <Image
            source={{
              uri: profileUImage || 'https://s3-alpha-sig.figma.com/img/3728/a488/6b91537a04814f17c6a4ef090f299bdf?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=JLiCJlWRaBW1RlPULusgAsp~XFYsNNnB-82bLA79XX~Hk23aiHmkXEQo9CaY8j8XxXeJim6EBHJxyZ35GFM8SvQNHXG3m2Q1qk2oNsczPXFOiPv7CACt6pLs9Cwy614SKBS5cdHjFgCjvFyrn6IP3tIwP2-SQffqUJyWQm2nzmWKTS2DNp~TWbtHGYyVt2rGnUUrmXtcf7iIHdQcoKzcBBO5WvGPbIc1htrc5w-xpepKmk1TWL-A~vzmp5Byj7L~nkmkMyoHlYglJURg4VcAL6lu32NHP~liWaw7GmabufgP-FZ6w6wHLnZ9siaxM05TmBs38QT5BmG3~Lih0q0q-Q__'
            }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
    
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>First name</Text>
          <TextInput
            style={styles.input}
            placeholder="Value"
            placeholderTextColor="#999"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Last name</Text>
          <TextInput
            style={styles.input}
            placeholder="Value"
            placeholderTextColor="#999"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contact Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Value"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={contactNumber}
            onChangeText={setContactNumber}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

      <Image
        source={{
          uri: 'https://s3-alpha-sig.figma.com/img/8995/10f6/5efd349079a91edc875a4766c9f16ae8?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Fd-UHyBxHgKqTau-cGaCiGmHdXN8ulsa3Q1NzLPOiFEzWS-vae-99Ntu4PU~TvpqIX5ac4kBU5gFRyT~gQeaKclTP1dXk4KMmQAbUbrs56cZFNSeMW2to9lx8XJuUjAkkUpxQGL42J0mWPgmtdUIZgSmllQI3fb~VL5VkO9TMlzoGgGps-Z~a4rUN3TGIlIfTFZGBV99t4XKODMrcXWEJgoKQRxernto1FKh36-df4ecm5XkGDPZViBrIfPaz1cFxEOPQjDIKNYSyJ8HIGBLBakYhtt9WDucy4tC~BSAJ7SM1K09xZVvxOoylLKvyc~JbepN2ottFixRytIsjaJJgw__'
        }}
        style={styles.backgroundPattern}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 30,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  iconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007BFF',
    borderRadius: 20,
    padding: 8,
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color:'black'
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color:'black'
  },
  saveButton: {
    width: '90%',
    height: 50,
    backgroundColor: 'red',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  backgroundPattern: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: width * 0.8,
    height: height * 0.4,
    opacity: 0.1,
    zIndex: -1,
  },
});

export default ProfileScreen;
