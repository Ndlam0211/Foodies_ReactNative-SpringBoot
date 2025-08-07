import { View, Image } from 'react-native'
import React from 'react'
import { useStyles } from 'react-native-unistyles'
import { emptyStyles } from '@/unistyles/emptyStyles'

const ReorderScreen = () => {
    const {styles} = useStyles(emptyStyles);

    return (
        <View style={styles.container(false)}>
            <Image
                source={require("@/assets/images/coming_soon.jpg")}
                style={styles.emptyImage}
            />
        </View>
    );
}

export default ReorderScreen