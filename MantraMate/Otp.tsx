
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Alert, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  Image,
  Dimensions 
} from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../App';
import { useAuth } from './Auth/UserAuthProvider';
import { PANDIT_LOGIN_URL } from '../config/Env';
const { width, height } = Dimensions.get('window');

type Props = StackNavigationProp<StackParamList, 'OTP'>;

const Otp = () => {
  const navigation = useNavigation<Props>();
  const [otp, setOtp] = useState<string>('');
  const route = useRoute();
  const { setTokens, setUserData } = useAuth();



  const handleVerifyOtp = async () => {
    const params = route.params as { phoneNumber?: string };
    const phoneNumber = params.phoneNumber || '';

    console.log('phone number', phoneNumber);
    
    const data = { 
      contact_number: phoneNumber, 
      otp 
    };
    
    const headers = {
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

   
    if (!otp.trim()) {
      Alert.alert('Validation Error', 'Please enter the OTP.');
      return;
    }

    try {
      const response = await axios.post(`${PANDIT_LOGIN_URL}`, data, { headers });
      
      if (response.status === 200 && response.data.results) {
        const { access, refresh, data: userData } = response.data.results;


        setTokens(access, refresh);
        setUserData(userData);

        Alert.alert(
          'OTP Verified', 
          'Your OTP has been verified successfully.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('ProfileScreen')
            }
          ]
        );
      } else {
        Alert.alert(
          'Error', 
          'Unexpected response structure. Please try again later.'
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message || 'Server error 500';
        Alert.alert('Error', errorMessage);
      } else {
        console.error('Error:', error);
        Alert.alert(
          'Error', 
          'Something went wrong. Please try again later.'
        );
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
  
        <Image
          source={{ uri: 'https://s3-alpha-sig.figma.com/img/8995/10f6/5efd349079a91edc875a4766c9f16ae8?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Fd-UHyBxHgKqTau-cGaCiGmHdXN8ulsa3Q1NzLPOiFEzWS-vae-99Ntu4PU~TvpqIX5ac4kBU5gFRyT~gQeaKclTP1dXk4KMmQAbUbrs56cZFNSeMW2to9lx8XJuUjAkkUpxQGL42J0mWPgmtdUIZgSmllQI3fb~VL5VkO9TMlzoGgGps-Z~a4rUN3TGIlIfTFZGBV99t4XKODMrcXWEJgoKQRxernto1FKh36-df4ecm5XkGDPZViBrIfPaz1cFxEOPQjDIKNYSyJ8HIGBLBakYhtt9WDucy4tC~BSAJ7SM1K09xZVvxOoylLKvyc~JbepN2ottFixRytIsjaJJgw__' }}
          style={styles.topLeftBackground}
        />

        <Image
          source={{ uri: 'https://s3-alpha-sig.figma.com/img/851e/e166/339312f328c414bab71e9e34dceff81f?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=VsUWrDDEw78G0LknsjJmKjgyjFxImdsbpM9O4Dee1UVq8omGXjQ8xUPxc5utt6lryEoOqOsWoRlMaCV30xoTzzKi1ussiIS5pajExWgHIh~UvjvNdhkcMDuYMWTRjxOOAfALmWtw1YXgefs23utZJ1LDggEwcSZffBl0iWv4aY1CjyX84J76l-q46eapd9lzdbQs9DHJj43DbG7HoynFm-geTE-UXlCZnA-YoDbnHCMLhJslyMtN4aLLNo5exIDmDmWVHVOGnrdAu9LZu6Gl1Csjl4en9MS~4GT72b64d3Hoo-LlWJDIF~5i7b5hx0wPr4xw68JSt71C07vonJTi3g__' }}
          style={styles.middleLogo}
        />

    
        <Text style={styles.title}>Log in</Text>


        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Otp</Text>
          <TextInput
            style={styles.input}
            placeholder="Value"
            placeholderTextColor="#A9A9A9"
            onChangeText={setOtp}
            value={otp} 
          />
        </View>

      
        <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

     
        <Text style={styles.footerText}>Don't have an account?</Text>


        <Image
          source={{ uri: 'https://s3-alpha-sig.figma.com/img/3728/a488/6b91537a04814f17c6a4ef090f299bdf?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=JLiCJlWRaBW1RlPULusgAsp~XFYsNNnB-82bLA79XX~Hk23aiHmkXEQo9CaY8j8XxXeJim6EBHJxyZ35GFM8SvQNHXG3m2Q1qk2oNsczPXFOiPv7CACt6pLs9Cwy614SKBS5cdHjFgCjvFyrn6IP3tIwP2-SQffqUJyWQm2nzmWKTS2DNp~TWbtHGYyVt2rGnUUrmXtcf7iIHdQcoKzcBBO5WvGPbIc1htrc5w-xpepKmk1TWL-A~vzmp5Byj7L~nkmkMyoHlYglJURg4VcAL6lu32NHP~liWaw7GmabufgP-FZ6w6wHLnZ9siaxM05TmBs38QT5BmG3~Lih0q0q-Q__' }}
          style={styles.panditImage}
        />


        <Image
          source={{ uri: 'https://s3-alpha-sig.figma.com/img/8995/10f6/5efd349079a91edc875a4766c9f16ae8?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Fd-UHyBxHgKqTau-cGaCiGmHdXN8ulsa3Q1NzLPOiFEzWS-vae-99Ntu4PU~TvpqIX5ac4kBU5gFRyT~gQeaKclTP1dXk4KMmQAbUbrs56cZFNSeMW2to9lx8XJuUjAkkUpxQGL42J0mWPgmtdUIZgSmllQI3fb~VL5VkO9TMlzoGgGps-Z~a4rUN3TGIlIfTFZGBV99t4XKODMrcXWEJgoKQRxernto1FKh36-df4ecm5XkGDPZViBrIfPaz1cFxEOPQjDIKNYSyJ8HIGBLBakYhtt9WDucy4tC~BSAJ7SM1K09xZVvxOoylLKvyc~JbepN2ottFixRytIsjaJJgw__' }}
          style={styles.bottomRightBackground}
        />


        <View style={styles.hindiTextContainer}>
          <Text style={styles.hindiText}>पूजा पाठ हो या अनुष्ठान,</Text>
          <Text style={styles.hindiText}>पंडित मिलना हुआ आसान।</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  topLeftBackground: {
    position: 'absolute',
    width: width * 1.5,
    height: height * 0.7,
    top: -height * 0.25,
    left: -width * 0.8,
    opacity: 0.5,
  },
  middleLogo: {
    position: 'absolute',
    width: 52,
    height: 54,
    top: height * 0.09,
    left: width * 0.44,
  },
  title: {
    position: 'absolute',
    width: 111,
    height: 56, 
    top: 171,
    left: 139,
    color:'black',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    opacity: 1,
   

    fontSize:35,
    fontWeight: 'bold',
    textAlign: 'center',
  
    padding: 5,
  },
  inputContainer: {
    position: 'absolute',
    width: 272,
    top: height * 0.43,
    left: width * 0.16,
  },
  inputLabel: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    color:'black'
  },
  button: {
    position: 'absolute',
    width: 272,
    height: 36,
    top: height * 0.56,
    left: width * 0.16,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    position: 'absolute',
    width: 150,
    top: height * 0.62,
    left: width * 0.16,
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
  panditImage: {
    position: 'absolute',
    width: width * 0.87,
    height: height * 0.43,
    top: height * 0.62,
    left: width * 0.22,
  },
  bottomRightBackground: {
    position: 'absolute',
    width: width * 1.48,
    height: height * 0.67,
    top: height * 0.62,
    left: width * 0.05,
    opacity: 0.5,
  },
  hindiTextContainer: {
    position: 'absolute',
    width: 209,
    height: 53,
    top: height * 0.78,
    left: width * 0.08,
  },
  hindiText: {
    fontFamily: 'Yatra One',
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 28,
    letterSpacing: -0.4,
    textAlign: 'center',
    color: '#000',
  },
});

export default Otp;