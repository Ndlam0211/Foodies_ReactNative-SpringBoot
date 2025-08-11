import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'
import Icon from '../global/Icon'
import { goBack } from '@/utils/NavigationUtils'
import CustomText from '../global/CustomText'
import { Colors } from '@/unistyles/Constants'
import { RFValue } from 'react-native-responsive-fontsize'

const CheckoutHeader:FC<{title: string}> = ({title}) => {
  return (
    <SafeAreaView>
        <View style={styles.flexRow}>
            <View style={styles.flexRowGap}>
                <Pressable onPress={() => goBack()}>
                    <Icon name="chevron-back" iconFamily="Ionicons" size={16} /> 
                </Pressable>

                <View>
                    <CustomText
                        fontFamily="Okra-Bold"
                        fontSize={11}
                        style={styles.text}>
                        {title}
                    </CustomText>

                    <CustomText
                        fontFamily="Okra-Medium"
                        fontSize={10}
                        style={styles.text2}>
                        Delivering to Thủ Đức, TP.HCM
                    </CustomText>
                </View>
            </View>

            <View style={{width:20}}>
                <Icon 
                    iconFamily='Ionicons'
                    name='share-outline'
                    color={Colors.primary}
                    size={RFValue(16)}
                />
            </View>
        </View>
    </SafeAreaView>
  )
}

export default CheckoutHeader

const styles = StyleSheet.create({
  flexRow: {
    justifyContent: "space-between",
    padding: 10,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderBottomWidth: 0.6,
    borderColor: Colors.border,
  },
  flexRowGap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  text: {
    textAlign: "left",
  },
  text2: {
    textAlign: "left",
    opacity: 0.5,
  },
});
