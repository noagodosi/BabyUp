import React, { useState, FC } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button, Alert } from 'react-native';
import { ROUTES_NAMES } from '../consts/Routes';
import { GlobalStyles } from '../consts/styles';
import { emailNotFound, resetPassword } from '../consts/AlertMessegesConsts';
import { auth, sendPasswordResetEmail } from '../firebase';
import { InputContainerStyle } from '../types';

const PasswordResetPage: FC<{ navigation: any }> = ({ navigation }) => {
	const [email, setEmail] = useState('');
	const [validEmail, setValidEmail] = useState(true);

	const { LoginPage } = ROUTES_NAMES

	const handlePasswordResetButton = async () => {
		try {
			await sendPasswordResetEmail(auth, email)
			Alert.alert(resetPassword)
		} catch (e: any) {
			const error = e?.message?.split('/')?.[1]?.slice(0, -2)
			Alert.alert(error === 'user-not-found' ? emailNotFound : e?.message)
		}
	};

	const handleEmailChange = (emailValue: any) => {
		const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)
		setEmail(emailValue);
		setValidEmail(isEmailValid ? true : false)
	};

	return (
		<View style={styles.container}>
			<View style={styles.head}>
				<Text style={GlobalStyles.titleTextStyle}>איפוס סיסמא</Text>
			</View>
			<View style={GlobalStyles.inputContainerStyle as InputContainerStyle}>
				<TextInput
					style={GlobalStyles.inputStyle}
					placeholder="אימייל"
					value={email}
					onChangeText={handleEmailChange}
					keyboardType="email-address"
					autoCapitalize="none"
					autoCorrect={false}
				/>
			</View>
			{!validEmail && (
				<Text style={GlobalStyles.errorText}>יש להזין כתובת מייל חוקית  </Text>
			)}

			<TouchableOpacity style={GlobalStyles.buttonPinkStyle} onPress={handlePasswordResetButton}>
				<Text style={GlobalStyles.buttonPinkTextStyle}>אפס סיסמא</Text>
			</TouchableOpacity>
			<Button color={GlobalStyles.colors.btnColor} title=" לעמוד ההתחברות" onPress={() => navigation.navigate(LoginPage)} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		paddingHorizontal: 20,
		backgroundColor: GlobalStyles.colors.appBodyBackColor,
	},
	head: {
		flex: 0.4,
		justifyContent: 'flex-end',
		margin: 20
	},
});


export default PasswordResetPage;