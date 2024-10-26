import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, TextInput, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEdit, faArrowLeft, faSignOutAlt,faSearch } from '@fortawesome/free-solid-svg-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../App';
import { useNavigation } from '@react-navigation/native';
import { PANDIT_URL, SERVICE_URL } from '../config/Env';
import { useAuth } from './Auth/UserAuthProvider';

interface Service {
  id: string;
  name: string;
  name_local_name: string;
  description: string;
  logo_image: string;
  isSelected?: boolean;
  isEditing?: boolean;
  category: { id: string, name: string }[];
  dakshina: number;
  duration: string;
  editedDakshina: number;
  editedDuration: string;
}
type prop=StackNavigationProp<StackParamList,'Services'>
const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showSelectedServices, setShowSelectedServices] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>(''); 
 const navigation=useNavigation<prop>();
     const {accessToken}=useAuth()
  useEffect(() => { 
        
    const fetchServices = async () => {
      try { 
       
        const response = await fetch(`${SERVICE_URL}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const result = await response.json();
        if (result.statusCode === 200) {
          setServices(result.results.data.map((service: Service) => ({
            ...service,
            isSelected: false,
            isEditing: false,
            editedDakshina: 15000,
            editedDuration: 2,
          })));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) 
  );

  const toggleServiceSelection = (id: string) => {
    const updatedServices = services.map(service => ({
      ...service,
      isSelected: service.id === id ? !service.isSelected : service.isSelected,
    }));
    setServices(updatedServices);
    
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter(serviceId => serviceId !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const toggleEditing = (id: string) => {
    setServices(services.map(service => ({
      ...service,
      isEditing: service.id === id ? !service.isEditing : service.isEditing,
    })));
  };

  const updateServiceDetails = (id: string, dakshina: number, duration: string) => {
    setServices(services.map(service => {
      if (service.id === id) {
        return {
          ...service,
          editedDakshina: dakshina,
          editedDuration: duration,
          isEditing: false,
        };
      }
      return service;
    }));
  };

  const removeSelectedService = (id: string) => {
    setSelectedServices(selectedServices.filter(serviceId => serviceId !== id));
    setServices(services.map(service => ({
      ...service,
      isSelected: service.id === id ? false : service.isSelected,
    })));
  };

  const getSelectedServicesData = () => {
    return services
      .filter(service => selectedServices.includes(service.id))
      .map(service => ({
        service: service.id,
        dakshina: service.editedDakshina || 0,
        duration: service.editedDuration || " ",
        category: service.category[0].id,
      }));
  };

  const submitSelectedServices = async () => {
    const selectedServicesData = getSelectedServicesData();
    if (selectedServicesData.length === 0) {
      Alert.alert('No Services Selected', 'Please select at least one service before submitting.');
      return;
    }
    const mainData = JSON.stringify(selectedServicesData);
    try {
      const response = await fetch(`${PANDIT_URL}/service`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        body: mainData,
      }});
      const result = await response.json();
      console.log('the response ', result)
      if (result.statusCode === 201) {
        Alert.alert('Success', 'Selected services have been added to your services .');
        setSelectedServices([]);
        setServices(services.map(service => ({ ...service, isSelected: false })));
      } else {
        Alert.alert('Error', 'service already exists please try chose new services ');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while submitting services. Please try again.');
    }
  };

  const renderSelectedServiceItem = ({ item }: { item: Service }) => (
    <View style={styles.serviceContainer}>
      <View style={styles.serviceContent}>
        <Image 
          source={{ uri: 'https://s3-alpha-sig.figma.com/img/f9d3/d97a/9ce99316ef414376f3014b3de31e162b?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RReaZUti34qOqzHmwZOzYzzA6gJ6SUdrhkujGwYYxy0xp5n3yS~dpBjSXTcDhFD38mwPjYfj6RSbwPlDdh7ZdgnkALpli3yYgZCJCzCbwgH0mpptaUG1KpygIK3Hr6dDy69tKGzjGUajRKfr0MPkB3eUaTq8eMDY5~ogbcWcVwhQBbuFauDQ3vG94~AHK8nntJ9KJ8DXWCDZ~yqtew37iJ1lzjbbMd15enB6R7By~mqLQp8dDuHT85Vsrk2yTfE7bFpBUr~8LisueReh7yw4p~vb~tRIJ1PYkA56a5RAdTBBG-ANw-W24Neyb4yaSY4zM0n3~PfPusr2WLgpUUHEBg__' }} 
          style={styles.serviceImage} 
        />
        <View style={styles.serviceDetails}>
          <Text style={styles.serviceDescription}>{item.name}</Text>
          {item.isEditing ? (
            <>
              <TextInput
                style={styles.editInput}
                value={String(item.editedDakshina || item.dakshina)}
                placeholder="Enter dakshina"
                keyboardType="numeric"
                onChangeText={(inp) => {
                  const dakshina = parseInt(inp); 
                  setServices(services.map(service => {
                    if (service.id === item.id) {
                      return {
                        ...service,
                        editedDakshina: dakshina, 
                      };
                    }
                    return service;
                  }));
                }}
              />
              <TextInput
                style={styles.editInput}
                value={String(item.editedDuration || item.duration)}
                placeholder="Enter duration"
                keyboardType="default"
                onChangeText={(text) => {
                  const duration = text;
                  setServices(services.map(service => {
                    if (service.id === item.id) {
                      return {
                        ...service,
                        editedDuration: duration, 
                      };
                    }
                    return service;
                  }));
                }}
              />
              <View style={styles.editButtonsContainer}>
                <TouchableOpacity
                  style={[styles.editButton, styles.saveButton]}
                  onPress={() => {
                    updateServiceDetails(
                      item.id,
                      item.editedDakshina || item.dakshina,
                      item.editedDuration || item.duration
                    );
                  }}
                >
                  <Text style={styles.editButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.editButton, styles.cancelButton]}
                  onPress={() => {
                    setServices(services.map(service => {
                      if (service.id === item.id) {
                        return {
                          ...service,
                          isEditing: false,
                          editedDakshina: service.dakshina,
                          editedDuration: service.duration,
                        };
                      }
                      return service;
                    }));
                  }}
                >
                  <Text style={styles.editButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.serviceInfo}>Dakshina: ₹{item.editedDakshina || item.dakshina}</Text>
              <Text style={styles.serviceInfo}>Duration: {item.editedDuration || item.duration} hours</Text>
            </>
          )}
        </View>
      </View>
      {!item.isEditing && (
        <TouchableOpacity 
          style={styles.editIcon}
          onPress={() => toggleEditing(item.id)}
        >
          <FontAwesomeIcon icon={faEdit} size={20} color="#d62828" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderServiceItem = ({ item }: { item: Service }) => (
    <TouchableOpacity 
      onPress={() => toggleServiceSelection(item.id)}
      style={[
        styles.serviceContainer,
        item.isSelected && styles.selectedService
      ]}
    >
      <View style={styles.serviceContent}>
        <Image 
          source={{ uri: 'https://s3-alpha-sig.figma.com/img/f9d3/d97a/9ce99316ef414376f3014b3de31e162b?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RReaZUti34qOqzHmwZOzYzzA6gJ6SUdrhkujGwYYxy0xp5n3yS~dpBjSXTcDhFD38mwPjYfj6RSbwPlDdh7ZdgnkALpli3yYgZCJCzCbwgH0mpptaUG1KpygIK3Hr6dDy69tKGzjGUajRKfr0MPkB3eUaTq8eMDY5~ogbcWcVwhQBbuFauDQ3vG94~AHK8nntJ9KJ8DXWCDZ~yqtew37iJ1lzjbbMd15enB6R7By~mqLQp8dDuHT85Vsrk2yTfE7bFpBUr~8LisueReh7yw4p~vb~tRIJ1PYkA56a5RAdTBBG-ANw-W24Neyb4yaSY4zM0n3~PfPusr2WLgpUUHEBg__' }} 
          style={styles.serviceImage} 
        />
        <View style={styles.serviceDetails}>
          <Text style={styles.serviceDescription}>{item.name}</Text>
          <Text style={styles.serviceDescription}>{item.name_local_name}</Text>
          <Text style={styles.serviceInfo}>Dakshina: ₹{item.editedDakshina || item.dakshina}</Text>
          <Text style={styles.serviceInfo}>Duration: {item.editedDuration || item.duration}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.editIcon}
        onPress={() => toggleEditing(item.id)}
      >
        <FontAwesomeIcon icon={faEdit} size={20} color="#d62828" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (showSelectedServices) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: 'https://s3-alpha-sig.figma.com/img/8995/10f6/5efd349079a91edc875a4766c9f16ae8?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Fd-UHyBxHgKqTau-cGaCiGmHdXN8ulsa3Q1NzLPOiFEzWS-vae-99Ntu4PU~TvpqIX5ac4kBU5gFRyT~gQeaKclTP1dXk4KMmQAbUbrs56cZFNSeMW2to9lx8XJuUjAkkUpxQGL42J0mWPgmtdUIZgSmllQI3fb~VL5VkO9TMlzoGgGps-Z~a4rUN3TGIlIfTFZGBV99t4XKODMrcXWEJgoKQRxernto1FKh36-df4ecm5XkGDPZViBrIfPaz1cFxEOPQjDIKNYSyJ8HIGBLBakYhtt9WDucy4tC~BSAJ7SM1K09xZVvxOoylLKvyc~JbepN2ottFixRytIsjaJJgw__'}} style={styles.backgroundImage} />

        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backIconContainer}
            onPress={() => setShowSelectedServices(false)}
          >
            <FontAwesomeIcon icon={faArrowLeft} size={20} color="#d62828" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Services</Text>
          <View style={styles.logoutIconContainer} />
        </View>

        <View style={styles.subHeaderContainer}>
          <Text style={styles.subHeaderText}>Saved services</Text>
          <TouchableOpacity onPress={() => setSelectedServices([])}>
            <Text style={styles.removeAllText}>Remove</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.selectedServicesCountContainer}>
          <Text style={styles.selectedServicesCount}>{selectedServices.length} services saved</Text>
        </View>

        <FlatList
          data={services.filter(service => selectedServices.includes(service.id))}
          renderItem={renderSelectedServiceItem}
          keyExtractor={(item) => item.id}
          style={styles.servicesList}
          contentContainerStyle={styles.servicesListContent}
        />

        <TouchableOpacity style={styles.bottomButton} onPress={submitSelectedServices}>
          <Text style={styles.bottomButtonText}>Add to my services</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://s3-alpha-sig.figma.com/img/8995/10f6/5efd349079a91edc875a4766c9f16ae8?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Fd-UHyBxHgKqTau-cGaCiGmHdXN8ulsa3Q1NzLPOiFEzWS-vae-99Ntu4PU~TvpqIX5ac4kBU5gFRyT~gQeaKclTP1dXk4KMmQAbUbrs56cZFNSeMW2to9lx8XJuUjAkkUpxQGL42J0mWPgmtdUIZgSmllQI3fb~VL5VkO9TMlzoGgGps-Z~a4rUN3TGIlIfTFZGBV99t4XKODMrcXWEJgoKQRxernto1FKh36-df4ecm5XkGDPZViBrIfPaz1cFxEOPQjDIKNYSyJ8HIGBLBakYhtt9WDucy4tC~BSAJ7SM1K09xZVvxOoylLKvyc~JbepN2ottFixRytIsjaJJgw__'}} style={styles.backgroundImage} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backIconContainer}>
          <FontAwesomeIcon icon={faArrowLeft} size={20} color="#d62828" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Services</Text>
        <TouchableOpacity style={styles.logoutIconContainer} onPress={()=>{navigation.navigate('out')}}>
          <FontAwesomeIcon icon={faSignOutAlt} size={20} color="#d62828" />
        </TouchableOpacity>
      </View>

      <View style={styles.categoryContainer}>
        <Text style={styles.categoryText}>Category: All</Text>
      </View>

      <View style={styles.searchContainer}>
      <FontAwesomeIcon icon={faSearch} size={20} color="#d62828" />
        <TextInput
          placeholder="Search service"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery} 
        />
      </View>

      <FlatList
        data={filteredServices}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id}
        style={styles.servicesList}
        contentContainerStyle={styles.servicesListContent}
      />

      {selectedServices.length > 0 && (
        <TouchableOpacity 
          style={styles.selectedCountContainer}
          onPress={() => setShowSelectedServices(true)}
        >
          <Text style={styles.selectedCountText}>
            {selectedServices.length} Services saved
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.bottomButton} onPress={submitSelectedServices}>
        <Text style={styles.bottomButtonText}>Add to my services</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
  },
  backIconContainer: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  logoutIconContainer: {
    padding: 8,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color:'black'
  },
  servicesList: {
    flex: 1,
  },
  servicesListContent: {
    padding: 16,
  },
  serviceContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedService: {
    borderWidth: 2,
    borderColor: '#d62828',
  },
  serviceContent: {
    flexDirection: 'row',
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  serviceDetails: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  serviceInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  editIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 4,
    marginTop: 4,
    fontSize: 14,
    color: 'black'
  },
  selectedCountContainer: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    backgroundColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedCountText: {
    color: '#fff',
    fontSize: 14,
  },
  bottomButton: {
    backgroundColor: '#d62828',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  bottomButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  subHeaderText: {
    fontSize: 16,
    color: '#666',
  },
  removeAllText: {
    fontSize: 14,
    color: '#d62828',
  },
  selectedServicesCountContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  selectedServicesCount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  serviceDescription: { fontSize: 14, color: '#777', marginVertical: 5, },
  editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    padding: 8,
    borderRadius: 5,
    minWidth: 80,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Services;