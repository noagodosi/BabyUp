import { useLayoutEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, ScrollView, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import { setFavoriteMeals } from '../store/redux/favorites';
import { GlobalStyles } from '../consts/styles';
import { Ionicons } from '@expo/vector-icons';
import { BackendError } from '../consts/AlertMessegesConsts';
import { retrieveUserData } from '../utils';
import { doc, db, setDoc } from '../firebase'
import { Collections } from '../consts/firebaseConsts';
import Subtitle from '../components/MealDetails/Subtitle';
import List from '../components/MealDetails/List';
import IconButton from '../components/IconButton';
import StarRating from 'react-native-star-rating';

type Props = {
	route: any;
	navigation: any;
}

const MealDetailScreen = ({ route, navigation }: Props) => {
	const { mealId, item: selectedMeal } = route.params;
	
	const favoriteMealIds: any = useSelector((state: any) => state.favoriteMeals.mealsIds);
	const favoriteMeals: any = useSelector((state: any) => state.favoriteMeals.meals);
	const [starCount, setStarCount] = useState(0);
	const [isFavorite, setIsFavorite] = useState(favoriteMealIds.includes(mealId));
	const dispatch = useDispatch();

	const onStarRatingPress = (rating: any) => {
		setStarCount(rating);
	};

	const changeFavoriteStatusHandler = async () => {
		try {
			const uid = await retrieveUserData()
			if (uid) {
				const docRef = doc(db, Collections.favorite, uid);
				let updatedFavoriteMeals = { ...favoriteMeals }
				if (isFavorite) {
					delete updatedFavoriteMeals[mealId]
					setIsFavorite(false)
				} else {
					setIsFavorite(true)
					updatedFavoriteMeals = { ...updatedFavoriteMeals, [mealId]: selectedMeal } // TODO check maybe to save only the ID and fetch them later in favorite tab
				}
				dispatch(setFavoriteMeals({ meals: updatedFavoriteMeals }))
				await setDoc(docRef, updatedFavoriteMeals);
			}
		} catch (e) {
			console.log(e)
			Alert.alert(BackendError)
		}
	}

	useLayoutEffect(() => {
		const isMealFavorite = favoriteMealIds.includes(mealId)
		navigation.setOptions({
			title: selectedMeal?.title,
			headerRight: () => {
				return (
					<IconButton
						icon={isMealFavorite ? 'heart' : 'heart-outline'}
						color="white"
						onPress={changeFavoriteStatusHandler}
					/>)
			}
		})
	}, [selectedMeal, favoriteMealIds, mealId])

	return (
		<ScrollView style={styles.container}>
			<Image source={selectedMeal?.imageBlob ? { uri: selectedMeal?.imageBlob } : require('../../assets/no-image.png')} style={styles.image} />
			<View style={styles.time}>
				<Ionicons name='time-outline' size={22} color={GlobalStyles.colors.btnColor} />
				<Text style={{ color: "#AAAAAA" }}>{selectedMeal?.duration} דקות </Text>
			</View>
			<View style={styles.allregyMealsContainer}>
				<View style={styles.allregyMeals}>
					<View style={styles.allregyMeal}>
						<Text style={styles.allergyName}>
							גלוטן
						</Text>
						{selectedMeal.allergies?.includes('1') ? <Ionicons name="close" size={18} color="white" /> : <Ionicons name="checkmark" size={18} color="white" />}
					</View>
					<View style={styles.allregyMeal}>
						<Text style={styles.allergyName}>
							חלב
						</Text>
						{selectedMeal.allergies?.includes('3') ? <Ionicons name="close" size={18} color="white" /> : <Ionicons name="checkmark" size={18} color="white" />}
					</View>
					<View style={styles.allregyMeal}>
						<Text style={styles.allergyName}>
							אגוזים
						</Text>
						{selectedMeal.allergies?.includes('2') ? <Ionicons name="close" size={18} color="white" /> : <Ionicons name="checkmark" size={18} color="white" />}
					</View>
					<View style={styles.allregyMeal}>
						<Text style={styles.allergyName}>
							ביצים
						</Text>
						{selectedMeal.allergies?.includes('4') ? <Ionicons name="close" size={18} color="white" /> : <Ionicons name="checkmark" size={18} color="white" />}
					</View>
				</View>
			</View>

			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<StarRating
					disabled={false}
					maxStars={5}
					starStyle={{ margin: 7 }}
					fullStarColor={GlobalStyles.colors.headerBackColor}
					emptyStarColor={GlobalStyles.colors.headerBackColor}
					starSize={18}
					rating={starCount}
					animation='flash'
					selectedStar={(rating: any) => onStarRatingPress(rating)}
				/>
			</View>

			<View style={styles.listOuterContainer}>
				<View style={styles.listContainer}>
					<Subtitle>מצרכים</Subtitle>
					<List data={selectedMeal?.ingredients?.split(',') || []} />
					<Subtitle>שלבים</Subtitle>
					<List data={selectedMeal?.steps?.split(',') || []} />
				</View>
			</View>
		</ScrollView >
	)
}

export default MealDetailScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 5,
		backgroundColor: GlobalStyles.colors.mealsBackColor,
	},
	image: {
		width: "100%",
		height: 280,
	},
	listOuterContainer: {
		alignItems: "center",
		marginBottom: 20
	},
	listContainer: {
		width: '80%',
	},
	allergyName: {
		fontSize: 12,
		textAlign: "center",
		color: "white",
	},
	allregyMealsContainer: {
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	allregyMeals: {
		flexDirection: 'row-reverse',
		alignItems: 'center',
		gap: 20,
		justifyContent: "space-around",
		backgroundColor: "pink",
		marginBottom: 10,
		borderRadius: 20,
		width: '60%',
		paddingVertical: 2,
		paddingHorizontal: 12,
	},
	allregyMeal: {
		flexDirection: 'row-reverse',
		flex: 0.2,
		justifyContent: 'center',
		alignItems: 'center'
	},
	time: {
		flexDirection: "row-reverse",
		alignItems: "center",
		alignSelf: "flex-end",
		paddingBottom: 7,
		margin: 10,
		gap: 4
	},
})
