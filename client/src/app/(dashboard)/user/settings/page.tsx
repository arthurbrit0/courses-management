import SharedNotificationSettings from '@/components/SharedNotificationSettings'
import React from 'react'

const UserSettings = () => {
  return (
    <div className="w-3/5"> 
        <SharedNotificationSettings title="Configurações de usuário" subtitle="Gerencie suas configurações de notificação."/>
    </div>
  )
}

export default UserSettings