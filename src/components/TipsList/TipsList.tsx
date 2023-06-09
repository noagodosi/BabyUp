import { View, StyleSheet, FlatList } from 'react-native';
import { GlobalStyles } from '../../consts/styles';
import TipsItem from './TipsItem';

type Props = {
	items: any[];
}

const TipsList = ({ items }: Props) => {
	const renderTipItem = (itemData: any) => {
		return <TipsItem item={itemData.item} />
	}

	return (
		<View style={styles.container}>
			<FlatList
				data={items}
				keyExtractor={(item): any => item.id}
				renderItem={renderTipItem}
			/>
		</View>
	)
}
export default TipsList

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: GlobalStyles.colors.mealsBackColor
	},
})