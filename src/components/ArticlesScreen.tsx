import { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native'
import { GlobalStyles } from '../consts/styles';
import { SCREEN_NAMES } from '../consts/Routes'
import ArticleList from './Articles/ArticleList';

const ArticlesScreen = ({ navigation, route }: any) => {
	const articles = route.params.articles;

	useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: () => (
				<View style={styles.homeHeader}>
					<Text style={styles.text}>{SCREEN_NAMES.newsScreenTitle}</Text>
					<Image
						source={require('../../assets/babyupLogoNew.png')}
						style={styles.image}
					/>
				</View>
			)
		})
	}, [])

	return (
		<ArticleList articles={articles} />
	)
}

export default ArticlesScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: GlobalStyles.colors.appBodyBackColor,
		justifyContent: "center",
		alignItems: "center"
	},
	text: {
		color: "white",
		fontSize: 18,
		textAlignVertical: "center",
		marginBottom: 5,
		letterSpacing: 0.8,
		textAlign: "center",
	},
	image: {
		resizeMode: 'contain',
		height: 45,
		width: 45
	},
	homeHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: "center"
	},
	textContainer: {
		backgroundColor: "white",
		alignContent: "center",
		alignItems: "center",
		justifyContent: "center",
		width: "60%",
		padding: 20
	},
	contentText: {
		textAlign: "right",
	},
	newsItem: {
		marginVertical: 12,
		marginHorizontal: 15,
		borderRadius: 5,
		backgroundColor: 'pink',
		shadowColor: "#ceb5a7",
		shadowOpacity: 0.2,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 6,
		overflow: Platform.OS === 'android' ? "hidden" : 'visible'
	},
})