import React, { useState, useEffect } from 'react'
import { Platform, Text, View, TouchableOpacity, TouchableWithoutFeedback, Image, TextInput, Modal, FlatList, KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { COLORS, SIZES, icons, FONTS, images } from '../constants'

const SignUp = ({ navigation }) => {

  const [isShowPassword, setIsShowPassword] = useState(false)
  const [areas, setAreas] = useState([])
  const [selectedArea, setSelectedArea] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  useEffect(() => {
    fetch(`https://restcountries.eu/rest/v2/all`)
      .then(res => res.json())
      .then(data => {
        const newAreas = data.map(item => ({
          code: item.alpha2Code,
          name: item.name,
          callingCode: `+${item.callingCodes && item.callingCodes.length > 0 ? item.callingCodes[0] : ''}`,
          flag: `https://www.countryflags.io/${item.alpha2Code}/flat/64.png`
        }))
        setAreas(newAreas)
        if (newAreas.length > 0) {
          let defaultData = newAreas.filter(a => a.code === "US")
          if (defaultData.length > 0) {
            setSelectedArea(defaultData[0])
            console.log(defaultData[0])
          }
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  function renderHeader() {
    return (
      <TouchableOpacity style={{ flexDirection: 'row', paddingHorizontal: SIZES.padding * 3, height: 80, alignItems: 'center' }} onPress={() => console.log("Pressed")}>
        <Image source={icons.back} resizeMode="contain" style={{ height: 20, width: 20, tintColor: COLORS.white }} />
        <Text style={{ marginLeft: SIZES.padding, color: COLORS.white, ...FONTS.h4 }}>Sign Up</Text>
      </TouchableOpacity>
    )
  }
  function renderLogo() {
    return (
      <View style={{ marginTop: SIZES.padding * 1.5, justifyContent: 'center', alignItems: 'center', height: 100 }}>
        <Image source={images.wallieLogo} resizeMode="contain" style={{ width: "60%", alignSelf: 'center' }} />
      </View>
    )
  }

  function renderForm() {
    return (
      <View style={{ marginTop: SIZES.padding * 3, marginHorizontal: SIZES.padding * 3 }}>
        {/* Full name  */}
        <View>
          <Text style={{ color: COLORS.lightGreen, ...FONTS.body3 }} >Full name</Text>
          <TextInput style={{
            marginVertical: SIZES.padding,
            borderBottomColor: COLORS.white,
            borderBottomWidth: 1,
            color: COLORS.white,
            ...FONTS.body3
          }} placeholder="Enter full name" placeholderTextColor={COLORS.white} selectionColor={COLORS.white} />
        </View>

        {/* Phone number  */}
        <View style={{ marginTop: SIZES.padding * 2 }} >
          <Text style={{ color: COLORS.lightGreen, ...FONTS.body3 }} >Phone number</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {/* Country code  */}
            <TouchableOpacity style={{ width: 100, height: 50, borderBottomColor: COLORS.white, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-around', ...FONTS.body2 }} onPress={() => setIsModalVisible(true)}>
              <View style={{ justifyContent: 'center' }}>
                <Image source={icons.down} resizeMode="contain" style={{ width: 10, height: 10, alignItems: 'center', tintColor: COLORS.white }} />
              </View>
              <View style={{ justifyContent: 'center', marginLeft: 5 }}>
                <Image source={{ uri: selectedArea?.flag }} resizeMode="contain" style={{ width: 30, height: 30 }} />
              </View>
              <View style={{ justifyContent: 'center', marginLeft: 5 }}>
                <Text style={{ color: COLORS.white, ...FONTS.body3 }}>{selectedArea?.callingCode}</Text>
              </View>
            </TouchableOpacity>

            {/* Phone number  */}
            <TextInput style={{ flex: 1, height: 50, borderBottomColor: COLORS.white, borderBottomWidth: 1, color: COLORS.white, marginLeft: SIZES.base, ...FONTS.body3 }} selectionColor={COLORS.white} placeholder="Enter phone number" placeholderTextColor={COLORS.white} />
          </View>
        </View>

        {/* Password    */}
        <View style={{ marginTop: SIZES.padding * 2 }}>
          <Text style={{ color: COLORS.lightGreen, ...FONTS.body3 }}>Password</Text>
          <TextInput style={{ height: 50, marginVertical: SIZES.padding, borderBottomColor: COLORS.white, color: COLORS.white, borderBottomWidth: 1, ...FONTS.body3 }} placeholder="Enter password" placeholderTextColor={COLORS.white} selectionColor={COLORS.white} secureTextEntry={!isShowPassword} />
          <TouchableOpacity style={{ position: 'absolute', right: 8, bottom: 25 }} onPress={() => console.log("Toggle password")} onPress={() => setIsShowPassword(prev => !prev)}>
            <Image source={isShowPassword ? icons.disable_eye : icons.eye} resizeMode="contain" style={{ width: 20, height: 20, tintColor: COLORS.white }} />
          </TouchableOpacity>
        </View>

        {/* Submit button  */}
        <View style={{ marginTop: SIZES.padding * 2 }}>
          <TouchableOpacity style={{ paddingVertical: SIZES.padding * 2, alignItems: 'center', backgroundColor: COLORS.black, borderRadius: 25 }} onPress={() => navigation.navigate("Home")}>
            <Text style={{ color: COLORS.white, ...FONTS.h3 }}>Continue</Text>
          </TouchableOpacity>
        </View>

      </View>
    )
  }


  function renderAreaCodesModal() {

    const renderItem = ({item})=>{
      return (
        <TouchableOpacity style={{padding: SIZES.padding, flexDirection: 'row' }} onPress={()=>{
          setSelectedArea(item)
          setIsModalVisible(false)
        }}>
          <Image source={{uri: item.flag}} style={{width :30, height: 30, marginRight: 10}} />
          <Text style={{...FONTS.body4}}>{item.name}</Text>
        </TouchableOpacity>
      )
    }
  
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
      >
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ height: 400, width: SIZES.width * 0.8, backgroundColor: COLORS.lightGreen, borderRadius: SIZES.radius }}>
              <FlatList data={areas} renderItem={renderItem} keyExtractor={(item)=>item.code} style={{padding: SIZES.padding * 2, marginBottom: SIZES.padding * 2}}  />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : null}>
      <LinearGradient colors={[COLORS.lime, COLORS.emerald]} style={{ flex: 1 }}>
        <ScrollView>
          {/* header  */}


          {/* Form  */}
          {renderHeader()}
          {renderLogo()}
          {renderForm()}

        </ScrollView>
      </LinearGradient>
      {renderAreaCodesModal()}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary
  }
})

export default SignUp
