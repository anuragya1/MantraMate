import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../App';
import { useNavigation } from '@react-navigation/native';
import { CATEGORY_URL } from '../config/Env';

const { width, height } = Dimensions.get('window');

interface Category {
  id: number;
  name: string;
  name_local_lang: string;
  description: string;
  image: string;
}
type prop=StackNavigationProp<StackParamList,'OTP'>
const CategoriesScreen = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const navigation=useNavigation<prop>()
  useEffect(() => {
    fetchCategories();
  }, []);
  const navi=()=>{
    navigation.navigate('Services')
  }
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
       `${CATEGORY_URL}`,
        {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI5NDE2ODgwLCJpYXQiOjE3MjkzMzA0ODAsImp0aSI6IjE4ZTFhZGMzODQ5ZTQ5ZmViMzY2YWMzYzJhMzA1ZWFhIiwidXNlcl9pZCI6MjQsImlzX3BhbmRpdCI6dHJ1ZX0.k5jnzIIh2GDBs5ytuTtJO_C1yzdhOVZ2WTMwb8lO7Ss',
          },
        }
      );
      setCategories(response.data.results.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategorySelect = (categoryId: number) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
    } else {
      setSelectedCategories((prev) => [...prev, categoryId]);
    }
  };

  const renderCategoryItem = ({ item }: { item: Category }) => {
    const isSelected = selectedCategories.includes(item.id);
    return (
      <TouchableOpacity
        style={[
          styles.categoryCard,
          isSelected && styles.categoryCardSelected,
        ]}
        onPress={() => handleCategorySelect(item.id)}
      >
        <Image
          source={{ uri: 'https://s3-alpha-sig.figma.com/img/f9d3/d97a/9ce99316ef414376f3014b3de31e162b?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RReaZUti34qOqzHmwZOzYzzA6gJ6SUdrhkujGwYYxy0xp5n3yS~dpBjSXTcDhFD38mwPjYfj6RSbwPlDdh7ZdgnkALpli3yYgZCJCzCbwgH0mpptaUG1KpygIK3Hr6dDy69tKGzjGUajRKfr0MPkB3eUaTq8eMDY5~ogbcWcVwhQBbuFauDQ3vG94~AHK8nntJ9KJ8DXWCDZ~yqtew37iJ1lzjbbMd15enB6R7By~mqLQp8dDuHT85Vsrk2yTfE7bFpBUr~8LisueReh7yw4p~vb~tRIJ1PYkA56a5RAdTBBG-ANw-W24Neyb4yaSY4zM0n3~PfPusr2WLgpUUHEBg__'}}
          style={styles.categoryImage}
          resizeMode="cover"
        />
        <View style={styles.categoryTextContainer}>
          <Text style={styles.categoryTitle}>
            {item.name} ({item.name_local_lang})
          </Text>
          <Text style={styles.categoryDescription}>
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>

      <Image
        source={{ uri: 'https://s3-alpha-sig.figma.com/img/8995/10f6/5efd349079a91edc875a4766c9f16ae8?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Fd-UHyBxHgKqTau-cGaCiGmHdXN8ulsa3Q1NzLPOiFEzWS-vae-99Ntu4PU~TvpqIX5ac4kBU5gFRyT~gQeaKclTP1dXk4KMmQAbUbrs56cZFNSeMW2to9lx8XJuUjAkkUpxQGL42J0mWPgmtdUIZgSmllQI3fb~VL5VkO9TMlzoGgGps-Z~a4rUN3TGIlIfTFZGBV99t4XKODMrcXWEJgoKQRxernto1FKh36-df4ecm5XkGDPZViBrIfPaz1cFxEOPQjDIKNYSyJ8HIGBLBakYhtt9WDucy4tC~BSAJ7SM1K09xZVvxOoylLKvyc~JbepN2ottFixRytIsjaJJgw__' }}
        style={styles.backgroundImage}
      />
      

      <Text style={styles.title}>Categories</Text>
      <Text style={styles.subtitle}>
        Please select all the categories in which you perform the Pooja.
      </Text>


      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.categoryList}
        contentContainerStyle={{ paddingBottom: 120 }}
      />


      <TouchableOpacity style={styles.nextButton} onPress={navi}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#3F3D56', 
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins',
    textAlign: 'center',
    marginBottom: 20,
    color: '#8A8A8A',
  },
  categoryList: {
    marginTop: 20,
  },
  categoryCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryCardSelected: {
    borderColor: '#FF4D00',
    borderWidth: 2,
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 15,
    marginRight: 15,
  },
  categoryTextContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: '#333333',
  },
  categoryDescription: {
    fontSize: 14,
    fontFamily: 'Poppins',
    color: '#777777',
  },
  nextButton: {
    backgroundColor: '#FF4D00', 
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 40,
    position: 'absolute',
    bottom: 30,
    left: '50%',
    transform: [{ translateX: -width * 0.25 }],
    width: width * 0.5,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins',
    color: '#fff',
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: width * 0.5,
    height: height * 0.5,
    opacity: 0.1,
    zIndex: -1,
  },
});

export default CategoriesScreen;
