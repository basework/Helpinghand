"use client"

import { useEffect, useState } from "react"
import { CheckCircle } from "lucide-react"

interface WithdrawalNotificationProps {
  onClose: () => void
}

export function WithdrawalNotification({ onClose }: WithdrawalNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [notificationData, setNotificationData] = useState<{
    name: string
    amount: string
    state: string
  } | null>(null)

  const [usedStates, setUsedStates] = useState<string[]>([])
  const [usedNames, setUsedNames] = useState<string[]>([])

  // Nigerian names grouped by tribe
  const nigerianNames = {
    Igbo: ["Chinedu","Emeka","Chioma","Ikechukwu","Chukwuma","Chinonso","Obinna","Ifemelu","Ifeanyi","Chukwuemeka","Nnenna","Uche","Ngozi","Adaeze","Chisom","Somto","Onyeka","Ugochukwu","Chizoba","Ijeoma"],
    Yoruba: ["Adebayo","Temitope","Kehinde","Babatunde","Titilayo","Funmilayo","Segun","Olumide","Oluwaseun","Tosin","Bisi","Adeola","Ayotunde","Femi","Modupe","Oluwadamilola","Olamide","Ireti","Lanre","Morenikeji"],
    Hausa: ["Aisha","Zainab","Ibrahim","Usman","Aliyu","Hadiza","Salamatu","Maryam","Hafsat","Abubakar","Sani","Fatima","Rakiya","Bilal","Aminu","Yusuf","Hajara","Maimuna","Nasiru","Zubairu"],
    Edo: ["Folake","Obioma","Oghene","Osamudiamen","Efe","Eseosa","Oluwatomi","Omoregie","Uyi","Olaoluwa","Aisosa","Idahosa","Osamuyi","Igiogbe","Ehikioya","Ehimen","Osarhiemen","Oghenemaro","Oghenemaro2","Oghenebror"],
    Tiv: ["Terver","Aondowase","Iorbee","Aondona","Kwagh","Terkimbi","Iorwese","Terkula","Tervar","Iorhima","Aondoba","Terngu","Kpav","Tersala","Iorwane","Terbeku","Terpande","Aondona","Terkuma","Terbenga"],
    Kanuri: ["Goni","Bello","Abdullahi","Hassan","Fatimah","Auwal","Musa","Rakiya","Salihu","Aisha","Yakubu","Halima","Mustapha","Maryam","Sadiya","Bukar","Zainab","Ibrahim","Umar","Hafsat"],
    Kanembu: ["Abakar","Abdoulaye","Maimouna","Oumar","Fatou","Issa","Sanda","Moussa","Aisha","Boubacar","Mahamat","Zeinab","Ali","Mariama","Abdel","Hassan","Ramatou","Oumarou","Hassana","Barka"],
    Efik: ["Iniobong","Uduak","Ekaette","Ekemini","Nsikak","Emem","Obong","Imaobong","Eyo","Eno","Itoro","Essien","Bassey","Ndifreke","Akpan","Eka","Owoidighe","Etim","Ekemini2","Adiaha"],
    English: ["John","James","Mary","Elizabeth","William","Emma","Michael","Olivia","Robert","Sophia","Charles","Isabella","Thomas","Mia","Daniel","Amelia","Matthew","Charlotte","Joseph","Ava"]
  }

  // Tribe to state mapping
  const tribeToStates: Record<string,string[]> = {
    Igbo: ["Enugu State","Anambra State","Imo State","Abia State","Ebonyi State"],
    Yoruba: ["Lagos State","Oyo State","Osun State","Ondo State","Ekiti State","Kwara State"],
    Hausa: ["Kano State","Kaduna State","Katsina State","Sokoto State","Bauchi State","Adamawa State","Yobe State","Taraba State"],
    Edo: ["Edo State","Delta State","Rivers State","Bayelsa State","Cross River State"],
    Tiv: ["Benue State","Niger State"],
    Kanuri: ["Borno State","Yobe State"],
    Kanembu: ["Borno State","Yobe State"],
    Efik: ["Akwa Ibom State","Cross River State"],
    English: ["FCT Abuja","Kaduna State","Lagos State","Oyo State","Rivers State"]
  }

  // Expanded withdrawal amounts
  const withdrawalAmounts = [
    "₦500,000","₦525,000","₦550,000","₦575,000","₦600,000","₦625,000","₦650,000","₦675,000",
    "₦700,000","₦725,000","₦750,000","₦775,000","₦800,000","₦825,000","₦850,000","₦875,000",
    "₦900,000","₦925,000","₦950,000","₦975,000","₦1,000,000","₦1,050,000","₦1,075,000","₦1,100,000",
    "₦1,125,000","₦1,150,000","₦1,175,000","₦1,200,000","₦1,225,000","₦1,250,000","₦1,275,000","₦1,300,000",
    "₦1,325,000","₦1,350,000","₦1,375,000","₦1,400,000","₦1,425,000","₦1,450,000","₦1,475,000","₦1,500,000"
  ]

  const getUniqueTribeState = () => {
    const tribes = Object.keys(nigerianNames)

    // Filter states and names to not used yet
    let availableTribes = tribes.filter(t => {
      return tribeToStates[t].some(s => !usedStates.includes(s))
    })

    if (availableTribes.length === 0) {
      // reset used arrays if all states used
      setUsedStates([])
      setUsedNames([])
      availableTribes = tribes
    }

    let selectedTribe = availableTribes[Math.floor(Math.random() * availableTribes.length)]
    let availableStates = tribeToStates[selectedTribe].filter(s => !usedStates.includes(s))
    let selectedState = availableStates[Math.floor(Math.random() * availableStates.length)]

    let availableNames = nigerianNames[selectedTribe].filter(n => !usedNames.includes(n))
    let selectedName = availableNames[Math.floor(Math.random() * availableNames.length)]

    // Update used arrays
    setUsedStates(prev => [...prev, selectedState])
    setUsedNames(prev => [...prev, selectedName])

    return { name: selectedName, state: selectedState }
  }

  useEffect(() => {
    const showNotification = () => {
      const { name, state } = getUniqueTribeState()
      const randomAmount = withdrawalAmounts[Math.floor(Math.random() * withdrawalAmounts.length)]
      setNotificationData({ name, amount: randomAmount, state })
      setIsVisible(true)

      setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300)
      }, 10000)

      localStorage.setItem("last_withdrawal_popup", Date.now().toString())
    }

    const checkAndShow = () => {
      const lastShown = localStorage.getItem("last_withdrawal_popup")
      const now = Date.now()
      if (!lastShown || now - parseInt(lastShown) > 120000) {
        setTimeout(showNotification, 3000)
      } else {
        const remaining = 120000 - (now - parseInt(lastShown))
        setTimeout(showNotification, remaining)
      }
    }

    checkAndShow()
  }, [onClose])

  if (!notificationData) return null

  return (
    <div
      className={`fixed top-4 left-4 right-4 z-50 transition-all duration-300 transform ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="bg-gradient-to-br from-gray-900 via-green-900 to-black rounded-lg shadow-lg border border-green-800/30 p-4 mx-auto max-w-sm relative overflow-hidden">
        <div className="absolute bottom-2 left-0 w-full h-4 bg-green-500/10 animate-pulse-light blur-md"></div>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-white">Withdrawal Successful!</div>
            <div className="text-xs text-gray-300 mt-1">
              <span className="font-medium">{notificationData.name}</span> just withdrew{" "}
              <span className="font-semibold text-green-400">{notificationData.amount}</span>
            </div>
            <div className="relative mt-1">
              <span className="text-[11px] text-green-300 font-medium inline-block animate-wiggle">
                🇳🇬 Location: {notificationData.state}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes wiggle {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }
        @keyframes pulse-light {
          0%, 100% { opacity: 0.2; transform: translateX(-10%); }
          50% { opacity: 0.6; transform: translateX(10%); }
        }
        .animate-pulse-light {
          animation: pulse-light 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}