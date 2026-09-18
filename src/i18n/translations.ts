export const translations = {

  es: {
    // Header & Global
    header: {
      title: "ASISTENCIA TÉCNICA",
      subtitle: "Tótem de Atención",
      reset: "Reiniciar",
      cancel: "Cancelar",
      stepOf: "Paso {current} de {total}",
    },
    // Idle Screen
    idle: {
      badge: "BIENVENIDO",
      title: "Asistencia Técnica Especializada",
      subtitle: "Diagnóstico, reparación y soporte oficial para tus dispositivos de alta tecnología",
      tapToStart: "Toca cualquier parte de la pantalla para comenzar",
      tapSubtitle: "Toque para iniciar su atención personalizada",
      brandsTitle: "Especialistas certificados en:",
    },
    // Language Modal
    languageModal: {
      title: "Seleccione su Idioma",
      subtitle: "Escolha seu idioma / Select your language",
      esName: "Español",
      ptName: "Português",
      enName: "English",
      esDesc: "Atención en español",
      ptDesc: "Atendimento em português",
      enDesc: "Service in English",
    },
    // Identification
    identification: {
      badge: "PASO 1",
      title: "Identificación del Cliente",
      subtitle: "Ingrese sus datos para asignarle su turno de atención personalizada",
      nameLabel: "Nombre y Apellido",
      namePlaceholder: "Ej: Nombre y Apellido",
      docTypeLabel: "Tipo de Documento",
      ciOption: "Cédula de Identidad (CI)",
      cpfOption: "Cadastro de Pessoa Física (CPF)",
      docNumberLabel: "Número de Documento",
      docPlaceholder: "Ej: 1234567 (solo números)",
      codePreviewTitle: "Código de Atención Asignado:",
      codePreviewHint: "Generado con tus iniciales y últimos 3 dígitos de tu documento",
      errorRequired: "Por favor complete su nombre y número de documento para continuar.",
      btnBack: "Volver",
      btnContinue: "Continuar a Servicios",
      toggleKeypad: "Teclado en Pantalla",
    },
    // Service Selection
    services: {
      badge: "PASO 2",
      title: "¿Qué dispositivo deseas consultar?",
      subtitle: "Selecciona la marca o categoría para derivarte con el especialista indicado",
      issueModalTitle: "Selecciona el motivo principal",
      issueModalSubtitle: "Ayúdanos a preparar el diagnóstico antes de llamarte",
      btnConfirmService: "Confirmar y Generar Turno",
      skipIssue: "Omitir detalle y emitir turno",
      btnBack: "Modificar datos",
    },
    // Ticket Summary
    ticket: {
      badge: "TURNO CONFIRMADO",
      title: "¡Tu turno ha sido generado!",
      subtitle: "Toma asiento en la sala de espera. Tu código será llamado en la pantalla de recepción.",
      codeLabel: "TU CÓDIGO DE TURNO",
      clientLabel: "Cliente",
      documentLabel: "Documento",
      serviceLabel: "Servicio / Especialidad",
      issueLabel: "Motivo",
      timeLabel: "Fecha y Hora",
      qrHint: "Escanea con tu cámara para seguir tu turno desde tu smartphone",
      btnDone: "Entendido / Finalizar",
      autoResetHint: "Esta pantalla regresará al inicio automáticamente en {seconds} segundos",
    },
    // Brands details
    brands: {
      apple: {
        name: "Apple",
        tagline: "iPhone, iPad, MacBook, iMac y Apple Watch",
        issues: ["Pantalla / Glass", "Batería / Rendimiento", "No enciende / Placa", "Cámara / Sensores", "Software / Restablecimiento", "Otro / Diagnóstico"],
      },
      samsung: {
        name: "Samsung",
        tagline: "Galaxy S, Z Fold/Flip, A Series, Tablets y Wearables",
        issues: ["Pantalla AMOLED / Táctil", "Batería / Puerto Tipo C", "Placa / No enciende", "Cámara / Audio", "Flasheo / Software", "Otro / Diagnóstico"],
      },
      dji: {
        name: "DJI",
        tagline: "Drones Mavic, Mini, Air, Avata, Gimbals Osmo y Action",
        issues: ["Calibración Gimbal / Cámara", "Brazos / Hélices / Motores", "Actualización Firmware", "Error de Sensores / IMU", "Batería Inteligente", "Otro / Diagnóstico"],
      },
      xiaomi: {
        name: "Xiaomi",
        tagline: "Smartphones Mi/Redmi/Poco, Scooters y Ecosistema",
        issues: ["Cambio de Pantalla", "Batería / Carga rápida", "Software MIUI / HyperOS", "Scooter Eléctrico", "Ecosistema / Smart Life", "Otro / Diagnóstico"],
      },
      joog: {
        name: "JOOG",
        tagline: "Smartwatches, audio portátil, gadgets y accesorios",
        issues: ["Batería / Carga", "Conectividad Bluetooth", "Pantalla táctil", "Audio / Micrófono", "Otro / Diagnóstico"],
      },
      general: {
        name: "Asistencia General",
        tagline: "Otras marcas, computadoras, audio, consolas y presupuestos",
        issues: ["Diagnóstico general multimarca", "Computadoras / Laptops", "Mantenimiento y Limpieza", "Consolas y periféricos", "Presupuesto previo", "Consulta técnica"],
      },
    }
  },

  pt: {
    // Header & Global
    header: {
      title: "ASSISTÊNCIA TÉCNICA",
      subtitle: "Totem de Atendimento",
      reset: "Reiniciar",
      cancel: "Cancelar",
      stepOf: "Etapa {current} de {total}",
    },
    // Idle Screen
    idle: {
      badge: "BEM-VINDO",
      title: "Assistência Técnica Especializada",
      subtitle: "Diagnóstico, reparo e suporte técnico qualificado para dispositivos de alta tecnologia",
      tapToStart: "Toque em qualquer lugar da tela para começar",
      tapSubtitle: "Toque para iniciar seu atendimento personalizado",
      brandsTitle: "Especialistas certificados em:",
    },
    // Language Modal
    languageModal: {
      title: "Selecione seu Idioma",
      subtitle: "Escolha seu idioma / Select your language",
      esName: "Español",
      ptName: "Português",
      enName: "English",
      esDesc: "Atención en español",
      ptDesc: "Atendimento em português",
      enDesc: "Service in English",
    },
    // Identification
    identification: {
      badge: "ETAPA 1",
      title: "Identificação do Cliente",
      subtitle: "Informe seus dados para gerar sua senha de atendimento prioritário",
      nameLabel: "Nome e Sobrenome",
      namePlaceholder: "Ex: Nome e Sobrenome",
      docTypeLabel: "Tipo de Documento",
      ciOption: "Documento de Identidade (RG / CI)",
      cpfOption: "Cadastro de Pessoa Física (CPF)",
      docNumberLabel: "Número do Documento",
      docPlaceholder: "Ex: 1234567 (somente números)",
      codePreviewTitle: "Código de Atendimento Gerado:",
      codePreviewHint: "Criado com suas iniciais e os últimos 3 dígitos do seu documento",
      errorRequired: "Por favor, preencha seu nome e número do documento para continuar.",
      btnBack: "Voltar",
      btnContinue: "Continuar para Serviços",
      toggleKeypad: "Teclado na Tela",
    },
    // Service Selection
    services: {
      badge: "ETAPA 2",
      title: "Qual dispositivo precisa de suporte?",
      subtitle: "Selecione a marca ou categoria para direcioná-lo ao técnico especialista",
      issueModalTitle: "Selecione o motivo principal",
      issueModalSubtitle: "Ajude-nos a agilizar o diagnóstico do seu aparelho",
      btnConfirmService: "Confirmar e Gerar Senha",
      skipIssue: "Pular detalhe e gerar senha",
      btnBack: "Alterar dados",
    },
    // Ticket Summary
    ticket: {
      badge: "SENHA CONFIRMADA",
      title: "Sua senha foi gerada com sucesso!",
      subtitle: "Aguarde na sala de espera. Seu código será chamado no painel da recepção.",
      codeLabel: "SUA SENHA DE ATENDIMENTO",
      clientLabel: "Cliente",
      documentLabel: "Documento",
      serviceLabel: "Serviço / Especialidade",
      issueLabel: "Motivo",
      timeLabel: "Data e Hora",
      qrHint: "Aponte a câmera do seu celular para acompanhar sua vez",
      btnDone: "Entendido / Concluir",
      autoResetHint: "Esta tela retornará ao início automaticamente em {seconds} segundos",
    },
    // Brands details
    brands: {
      apple: {
        name: "Apple",
        tagline: "iPhone, iPad, MacBook, iMac e Apple Watch",
        issues: ["Tela / Display frontal", "Bateria / Desempenho", "Não liga / Placa-mãe", "Câmera / Sensores", "Sistema / Restauração", "Outro / Diagnóstico"],
      },
      samsung: {
        name: "Samsung",
        tagline: "Galaxy S, Z Fold/Flip, Linha A, Tablets e Acessórios",
        issues: ["Tela AMOLED / Touch", "Bateria / Conector Tipo C", "Placa / Não liga", "Câmera / Microfone", "Software / Atualização", "Outro / Diagnóstico"],
      },
      dji: {
        name: "DJI",
        tagline: "Drones Mavic, Mini, Air, Avata, Gimbals Osmo e Action",
        issues: ["Calibração Gimbal / Câmera", "Braços / Hélices / Motores", "Atualização Firmware", "Erro de Sensores / IMU", "Bateria Inteligente", "Outro / Diagnóstico"],
      },
      xiaomi: {
        name: "Xiaomi",
        tagline: "Smartphones Mi/Redmi/Poco, Patinetes e Ecosistema",
        issues: ["Troca de Tela", "Bateria / Carga rápida", "Software MIUI / HyperOS", "Patinete Elétrico", "Ecosistema Mi / Conectividade", "Outro / Diagnóstico"],
      },
      joog: {
        name: "JOOG",
        tagline: "Smartwatches, fones de ouvido, caixas de som e acessórios",
        issues: ["Bateria / Carga", "Conectividade Bluetooth", "Tela touch", "Áudio / Microfone", "Outro / Diagnóstico"],
      },
      general: {
        name: "Assistência Geral",
        tagline: "Outras marcas, notebooks, áudio, consoles e orçamentos",
        issues: ["Diagnóstico geral multimarcas", "Computadores / Notebooks", "Manutenção preventiva / Limpeza", "Consoles e controles", "Orçamento prévio", "Consulta técnica"],
      },
    }
  },

  en: {
    // Header & Global
    header: {
      title: "TECHNICAL SUPPORT",
      subtitle: "Kiosk Check-in",
      reset: "Restart",
      cancel: "Cancel",
      stepOf: "Step {current} of {total}",
    },
    // Idle Screen
    idle: {
      badge: "WELCOME",
      title: "Specialized Technical Support",
      subtitle: "Professional diagnosis, certified repair, and high-tech device support",
      tapToStart: "Touch anywhere on the screen to begin",
      tapSubtitle: "Tap to start your check-in process",
      brandsTitle: "Certified specialists in:",
    },
    // Language Modal
    languageModal: {
      title: "Select Your Language",
      subtitle: "Escolha seu idioma / Seleccione su idioma",
      esName: "Español",
      ptName: "Português",
      enName: "English",
      esDesc: "Atención en español",
      ptDesc: "Atendimento em português",
      enDesc: "Service in English",
    },
    // Identification
    identification: {
      badge: "STEP 1",
      title: "Customer Check-in",
      subtitle: "Enter your information to receive your personalized queue ticket",
      nameLabel: "Full Name",
      namePlaceholder: "e.g. First & Last Name",
      docTypeLabel: "Document Type",
      ciOption: "National ID (CI / Passport)",
      cpfOption: "Tax ID (CPF / SSN)",
      docNumberLabel: "Document Number",
      docPlaceholder: "e.g. 1234567 (numbers only)",
      codePreviewTitle: "Assigned Ticket Code:",
      codePreviewHint: "Generated from your initials and last 3 digits of your ID",
      errorRequired: "Please provide both your name and document number to proceed.",
      btnBack: "Back",
      btnContinue: "Continue to Services",
      toggleKeypad: "On-Screen Keyboard",
    },
    // Service Selection
    services: {
      badge: "STEP 2",
      title: "What device can we help you with today?",
      subtitle: "Select the brand or category to route you to the right specialist",
      issueModalTitle: "Select main reason or issue",
      issueModalSubtitle: "Help our team prepare the diagnostic ahead of time",
      btnConfirmService: "Confirm & Generate Ticket",
      skipIssue: "Skip issue details and issue ticket",
      btnBack: "Change details",
    },
    // Ticket Summary
    ticket: {
      badge: "TICKET ISSUED",
      title: "Your ticket has been generated!",
      subtitle: "Please have a seat in the waiting area. Your code will be called on the reception display.",
      codeLabel: "YOUR TICKET NUMBER",
      clientLabel: "Customer",
      documentLabel: "Document",
      serviceLabel: "Service / Brand",
      issueLabel: "Reported Issue",
      timeLabel: "Date & Time",
      qrHint: "Scan with your phone to track your queue status on mobile",
      btnDone: "Got it / Done",
      autoResetHint: "This screen will reset to welcome in {seconds} seconds",
    },
    // Brands details
    brands: {
      apple: {
        name: "Apple",
        tagline: "iPhone, iPad, MacBook, iMac & Apple Watch",
        issues: ["Screen / Front Glass", "Battery / Performance", "Won't Turn On / Logic Board", "Camera / Sensors", "Software / Factory Reset", "Other / Full Diagnosis"],
      },
      samsung: {
        name: "Samsung",
        tagline: "Galaxy S, Z Fold/Flip, A Series, Tablets & Wearables",
        issues: ["AMOLED Display / Touch", "Battery / USB-C Port", "Board / Power Failure", "Camera / Speaker", "Software / Flashing", "Other / Full Diagnosis"],
      },
      dji: {
        name: "DJI",
        tagline: "Mavic, Mini, Air, Avata Drones, Osmo Gimbals & Action",
        issues: ["Gimbal / Camera Calibration", "Arms / Propellers / Motors", "Firmware Update", "Sensor / IMU Warning", "Intelligent Battery", "Other / Full Diagnosis"],
      },
      xiaomi: {
        name: "Xiaomi",
        tagline: "Mi/Redmi/Poco Smartphones, E-Scooters & Mi Ecosystem",
        issues: ["Screen Replacement", "Battery / Fast Charging", "HyperOS / MIUI Software", "Electric Scooter Service", "Smart Home / Connectivity", "Other / Full Diagnosis"],
      },
      joog: {
        name: "JOOG",
        tagline: "Smartwatches, earbuds, portable audio and accessories",
        issues: ["Battery / Charging", "Bluetooth Connectivity", "Touchscreen", "Audio / Mic", "Other / Full Diagnosis"],
      },
      general: {
        name: "General Support",
        tagline: "Other brands, computers, audio, consoles & custom quotes",
        issues: ["Multi-brand hardware diagnosis", "PC / Laptop Maintenance", "Thermal paste & Deep Cleaning", "Gaming Consoles & Peripherals", "Official Quote", "Technical Consultation"],
      },
    }
  }
};
