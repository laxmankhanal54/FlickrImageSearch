import React, {useState, useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  FlatList,
  Platform,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import axios from 'axios';
import {SearchBar} from '@rneui/themed';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from './styles';
import {colors} from '../../Themes/colors';
import {Icon} from '@rneui/base';
import {appConfig} from '../../constants/appConfig';

const ImageSearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [images, setImages] = useState([]);
  const [totalImages, setTotalImages] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const searchTextInputRef = useRef(null);

  // Load search history from AsyncStorage
  useEffect(() => {
    loadSearchHistory();
  }, []);

  // Find search terms from history to search image for
  useEffect(() => {
    if (searchHistory && searchTerm !== '') {
      const filteredSearchHistory = searchHistory.filter(item => {
        return item.toLowerCase().includes(searchTerm.toLocaleLowerCase());
      });

      setSearchHistory(filteredSearchHistory);
    } else {
      loadSearchHistory();
    }
  }, [searchTerm]);

  // Fetch images whenever we need data for new page
  useEffect(() => {
    if (currentPage != 1) {
      fetchImages();
    }
  }, [currentPage]);

  // Fetch images whenever a search query is selected
  useEffect(() => {
    fetchImages();
  }, [searchQuery]);

  // Load search history from AsyncStorage
  const loadSearchHistory = async () => {
    try {
      const historyString = await AsyncStorage.getItem('@search_history');

      if (historyString) {
        const historyArray = JSON.parse(historyString);
        setSearchHistory(historyArray);
      }
    } catch (error) {
      console.error('Error loading search history: ', error);
    }
  };

  // Save search history to AsyncStorage
  const saveSearchHistory = async query => {
    try {
      let historyArray = [];
      const historyString = await AsyncStorage.getItem('@search_history');

      if (historyString) {
        historyArray = JSON.parse(historyString);
      }

      historyArray.push(query.trim());

      await AsyncStorage.setItem(
        '@search_history',
        JSON.stringify(historyArray),
      );
    } catch (error) {
      console.error('Error saving search history: ', error);
    }
  };

  // Handle search query submission
  const handleSearch = async query => {
    Keyboard.dismiss();
    setSearchQuery(query);

    if (query.trim() !== '') {
      setCurrentPage(1);
      setSearchTerm('');

      const matchingArray = searchHistory.filter(
        item => item.toLocaleLowerCase() === query.toLocaleLowerCase(),
      );

      if (matchingArray && matchingArray.length === 0) {
        saveSearchHistory(query);
      }
    }
  };

  const handleChangeText = text => {
    setSearchTerm(text);
  };

  // Fetch search results from the Flickr API
  const fetchImages = async () => {
    if (searchQuery === '') {
      setImages([]);
      return;
    }

    try {
      setLoading(true);
      const searchUrl = `${appConfig.apiUrl}${searchQuery}&page=${currentPage}`;
      const response = await axios.get(searchUrl);

      console.log(response, 'response');

      if (response.status === 200) {
        const allPhotos = response.data.photos;
        const newImages = allPhotos.photo;

        setImages(prevImages =>
          currentPage === 1 ? newImages : [...prevImages, ...newImages],
        );
        setTotalImages(allPhotos.total);
        setLoading(false);
      } else {
        throw Error('Api Error');
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const renderContent = () => {
    // Render search result item
    const renderResultItem = ({item}) => {
      const imgUrl = `${appConfig.imageBaseUrl}${item.server}/${item.id}_${item.secret}_q.jpg`;

      return <FastImage source={{uri: imgUrl}} style={styles.image} />;
    };

    const renderFooter = () => {
      const shouldRenderFooter = loading && currentPage !== 1;

      return shouldRenderFooter ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.activityIndicator} />
        </View>
      ) : null;
    };

    // Load more search results when user scrolls near the end of the list
    const handleLoadMore = () => {
      if (!loading && images && images.length < totalImages) {
        setCurrentPage(prevPage => prevPage + 1);
      }
    };

    if (loading && currentPage === 1) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large'} />
        </View>
      );
    }

    const hasSearchResults = images && images.length > 0;

    if (hasSearchResults) {
      return (
        <FlatList
          data={images}
          numColumns={2}
          renderItem={renderResultItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listItem}
          onEndReached={handleLoadMore}
          columnWrapperStyle={styles.columnWrapper}
          onEndReachedThreshold={0.1} // Set the threshold for the onEndReached event
          ListFooterComponent={renderFooter}
        />
      );
    } else if (searchQuery) {
      return (
        <View style={styles.emptyViewContainer}>
          <Text
            style={
              styles.emptyText
            }>{`No Results Found for ${searchQuery}`}</Text>
        </View>
      );
    }
  };

  const renderSearchHistory = () => {
    const renderFooter = searchTerm.trim() !== '';

    // Handle click on a search history item
    const handleHistoryItemClick = item => {
      handleSearch(item);
    };

    // Render search history item
    const renderHistoryItem = ({item}) => (
      <TouchableOpacity
        style={styles.historyItem}
        onPress={() => handleHistoryItemClick(item)}>
        <Icon name="search" size={24} />
        <Text style={styles.historyText}>{item}</Text>
      </TouchableOpacity>
    );

    return (
      <View style={styles.historyContainer}>
        <FlatList
          data={searchHistory}
          renderItem={renderHistoryItem}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={styles.historyFooter}>
          {renderFooter && (
            <TouchableOpacity
              onPress={() => {
                handleSearch(searchTerm);
              }}>
              <Text>
                <Text>Search results for </Text>
                <Text style={styles.searchTerm}>{searchTerm}</Text>
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SearchBar
        ref={searchTextInputRef}
        platform={Platform.OS}
        placeholder="Search..."
        onChangeText={handleChangeText}
        value={searchTerm}
        showLoading={loading}
        onFocus={() => {
          loadSearchHistory();
          setSearchFocused(true);
        }}
        onBlur={() => {
          setSearchFocused(false);
        }}
        searchIcon={{name: 'search'}}
        clearIcon={{name: 'backspace'}}
      />
      <View style={styles.contentWrapper}>
        {renderContent()}
        {searchFocused && renderSearchHistory()}
      </View>
    </View>
  );
};

export default ImageSearchScreen;
