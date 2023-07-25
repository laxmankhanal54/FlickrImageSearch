import {StyleSheet} from 'react-native';
import {spacings} from '../../Themes/metrics';
import {colors} from '../../Themes/colors';

export default StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    padding: spacings.s4,
  },
  listItem: {
    justifyContent: 'space-between',
    gap: spacings.s4,
  },
  image: {
    width: '48%',
    aspectRatio: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  contentWrapper: {
    position: 'relative',
    flex: 1,
  },
  emptyViewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 20,
    color: colors.message,
  },
  searchTerm: {
    color: '#4378d3',
    fontSize: 16,
  },
  historyContainer: {
    backgroundColor: colors.placeholder,
    // flex: 0.5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    position: 'absolute',
    padding: spacings.s4,
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  historyItem: {
    padding: spacings.s4,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.separator,
  },
  historyText: {
    fontSize: 16,
    marginLeft: spacings.s1,
  },
  historyFooter: {
    height: 40,
    justifyContent: 'center',
  },
});
