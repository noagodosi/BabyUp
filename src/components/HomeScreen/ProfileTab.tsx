import { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native'
import { GlobalStyles } from '../../consts/styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { EMPTY_STRING } from '../../consts/GeneralConsts';
import { logoutHandler, retrieveUserData } from '../../utils';
import { getDoc, doc, db, onSnapshot } from '../../firebase'
import { UPDATED_Allergies } from '../../consts';
import { BabyInfo } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { Collections } from '../../consts/firebaseConsts';
import { setUserInfo } from '../../store/general';
import moment from 'moment';
import CustomModal from '../CustomModal';
import UpdateBabyInfoModal from './UpdateBabyInfoModal';

const INITIAL_BABY_INFO_VALUE = {
	babyAge: EMPTY_STRING,
	babyName: EMPTY_STRING,
	babyBirthDate: EMPTY_STRING,
	parentName: EMPTY_STRING,
	gender: EMPTY_STRING,
	selectedAllergies: []
}

export let babyGender = EMPTY_STRING

export const ProfileTab = ({ navigation }: any) => {
	const [babyInfo, setBabyInfo] = useState<BabyInfo>(INITIAL_BABY_INFO_VALUE)
	const [isUpdateBabyInfoModalOpen, setIsUpdateBabyInfoModalOpen] = useState<boolean>(false)
	const [isInfoChanged, setIsInfoChanged] = useState(false);

	const isBabyInfoHasChanged = useSelector((state: any) => state.general.isBabyInfoHasChanged)
	const dispatch = useDispatch()

	useLayoutEffect(() => {
		const fetchUserInfo = async () => {
			const user = await retrieveUserData()
			if (user) {
				const docRef = await getDoc(doc(db, Collections.users, user));
				const docData: any = docRef.data()
				const { babyName, babyBirthDate, parentName, gender, selectedAllergies } = docData || {};
				const ageMonths = getAgeMonth(babyBirthDate)
				setBabyInfo({
					babyAge: ageMonths.toString(),
					babyBirthDate: babyBirthDate,
					babyName,
					parentName,
					gender: gender === 'MALE' ? 'זכר' : 'נקבה',
					selectedAllergies
				})
				dispatch(setUserInfo({ userInfo: { parentName, selectedAllergies } }))
			}
		}
		fetchUserInfo()
	}, [isBabyInfoHasChanged])

	useEffect(() => {
		const fetchChangesFromDB = async () => {
			const user = await retrieveUserData()
			if (user) {
				onSnapshot(doc(db, Collections.users, user), (doc) => {
					const { babyBirthDate, babyName, parentName, gender, selectedAllergies } = doc.data() || {}
					const ageMonths = getAgeMonth(babyBirthDate)
					setBabyInfo({
						babyAge: ageMonths.toString(),
						babyBirthDate: babyBirthDate,
						babyName,
						parentName,
						gender: gender === 'MALE' ? 'זכר' : 'נקבה',
						selectedAllergies
					})
				});
			}
			setIsInfoChanged(false)
		}
		fetchChangesFromDB()
	}, [isInfoChanged])

	const getAgeMonth = (babyBirthDate: any) => {
		return moment().diff(moment(babyBirthDate), 'months');
	}

	const onModalClose = () => {
		setIsInfoChanged(true)
		setIsUpdateBabyInfoModalOpen(false)
	}

	return (
		<View style={[styles.profileTabScreen, { backgroundColor: babyInfo?.gender === 'נקבה' ? '#ffe4f3' : "#E9F8F9" }]}>
			<Image source={require('../../../assets/babyupLogoNew.png')} style={styles.image} />
			<Text style={[GlobalStyles.titleTextStyleName, { color: babyInfo?.gender === 'נקבה' ? '#fb6f92' : "#6DA9E4", }]}>{babyInfo?.babyName}'s Mommy</Text>
			<View style={styles.innerComponent}>
				<TouchableOpacity onPress={() => logoutHandler(navigation)} style={GlobalStyles.buttonLightStyle}>
					<Text style={[GlobalStyles.buttonLightTextStyle, { color: babyInfo?.gender === 'נקבה' ? '#fb6f92' : "#6DA9E4", }]}>התנתקות</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => setIsUpdateBabyInfoModalOpen(true)} style={GlobalStyles.buttonLightStyle}>
					<Text style={[GlobalStyles.buttonLightTextStyle, { color: babyInfo?.gender === 'נקבה' ? '#fb6f92' : "#6DA9E4", }]}>עריכת פרופיל</Text>
				</TouchableOpacity>
				{isUpdateBabyInfoModalOpen && (
					<CustomModal onClose={() => setIsUpdateBabyInfoModalOpen(false)} visible={isUpdateBabyInfoModalOpen} animationType='fade' transparent>
						<UpdateBabyInfoModal babyInfo={babyInfo} onClose={onModalClose} />
					</CustomModal>
				)}
			</View>
			<View style={[styles.deatils, { backgroundColor: babyInfo?.gender === 'זכר' ? '#B9E0FF' : '#FFD6EC' }]}>
				<View style={styles.innerDetails}>
					<Text style={[styles.titleDetails, { color: babyInfo?.gender === 'זכר' ? '#6DA9E4' : "#FF8DC7" }]}>שם</Text>
					<Text style={styles.textDetails}>{babyInfo?.babyName}</Text>
				</View>
				<View style={styles.innerDetails}>
					<Text style={[styles.titleDetails, { color: babyInfo?.gender === 'זכר' ? '#6DA9E4' : "#FF8DC7" }]}>הורה</Text>
					<Text style={styles.textDetails}>{babyInfo?.parentName}</Text>
				</View>
				<View style={styles.innerDetails}>
					<Text style={[styles.titleDetails, { color: babyInfo?.gender === 'זכר' ? '#6DA9E4' : "#FF8DC7" }]}>גיל</Text>
					<Text style={styles.textDetails}>{babyInfo?.babyAge} חודשים</Text>
				</View>
				<View style={styles.innerDetails}>
					<Text style={[styles.titleDetails, { color: babyInfo?.gender === 'זכר' ? '#6DA9E4' : "#FF8DC7" }]}>מין</Text>
					<Text style={styles.textDetails}>{babyInfo.gender}</Text>
				</View>
				<View style={styles.innerDetails}>
					<Text style={[styles.titleDetails, { color: babyInfo?.gender === 'זכר' ? '#6DA9E4' : "#FF8DC7" }]}>רגישויות </Text>
					{babyInfo?.selectedAllergies?.length > 0 ? (
						babyInfo.selectedAllergies.map((allergy: boolean, index: number) => {
							const allergyData = UPDATED_Allergies?.[index] || {}
							return (
								<>
									{allergy && <Text key={allergyData.id} style={styles.textDetails}>{allergyData.name}</Text>}
								</>
							)
						})) : (
						<Text style={styles.textDetails}>אין</Text>
					)}
				</View>
			</View>

		</View>
	)
};

const styles = StyleSheet.create({
	image: {
		width: 250,
		height: 250,
		resizeMode: "contain"
	},
	innerComponent: {
		flexDirection: 'row',
		gap: 6,
		marginBottom: 15
	},
	deatils: {
		flexDirection: "column",
		justifyContent: 'center',
		alignItems: "flex-end",
		width: "75%",
		gap: 10,
		borderRadius: 8,
		paddingVertical: 10
	},
	titleDetails: {
		fontSize: 18,
		color: "#FF8DC7"
	},
	textDetails: {
		fontSize: 18,
		color: "white"
	},
	innerDetails: {
		flexDirection: "row-reverse",
		marginHorizontal: 20,
		gap: 10,
		alignItems: 'center',
		justifyContent: 'center'
	},
	profileTabScreen: {
		flex: 1,
		paddingTop: 35,
		alignItems: "center",
	},
});