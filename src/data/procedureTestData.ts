export interface DragStep {
  id: string;
  stepNumber: number;
  text: string;
}

export interface McSingleQuestion {
  id: string;
  type: 'mc_single';
  competency: 'structure_goal' | 'imperative_language' | 'inference_troubleshoot';
  title: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

export interface McMultipleQuestion {
  id: string;
  type: 'mc_multiple';
  competency: 'structure_goal' | 'imperative_language' | 'inference_troubleshoot';
  title: string;
  question: string;
  minSelections: number;
  maxSelections: number;
  instructionText: string;
  options: { id: string; text: string }[];
  correctAnswers: string[];
  explanation: string;
}

export interface CategorizedStatement {
  id: string;
  statement: string;
  correctCategory: 'Sesuai' | 'Tidak Sesuai';
  explanation: string;
}

export interface CategorizedQuestion {
  id: string;
  type: 'categorized_mc';
  competency: 'structure_goal' | 'imperative_language' | 'inference_troubleshoot';
  title: string;
  question: string;
  categories: ['Sesuai', 'Tidak Sesuai'];
  statements: CategorizedStatement[];
}

export interface SequenceQuestion {
  id: string;
  type: 'drag_drop_sequence';
  competency: 'temporal_sequence';
  title: string;
  instruction: string;
  initialScrambledSteps: DragStep[];
  correctOrderIds: string[];
  explanation: string;
}

export type TKAQuestion = SequenceQuestion | McSingleQuestion | McMultipleQuestion | CategorizedQuestion;

export interface StageContent {
  stageId: number;
  tier: 'diagnostic' | 'advanced_hots' | 'foundation_mastery';
  tierLabel: string;
  badge: string;
  readingPassage: {
    title: string;
    subtitle: string;
    routeBadge: string;
    materials: string[];
    steps: { number: number; heading: string; detail: string }[];
    importantNotice: string;
  };
  questions: TKAQuestion[];
}

// Stage 1: Diagnostic Assessment - Transjakarta Electronic Card Boarding
export const STAGE_1_DATA: StageContent = {
  stageId: 1,
  tier: 'diagnostic',
  tierLabel: 'Stage 1: Diagnostic Test',
  badge: 'Koridor 1 · Blok M - Kota',
  readingPassage: {
    title: 'How to Board the Transjakarta BRT Using an Electronic Money Card',
    subtitle: 'Standard Operating Procedure for Commuters in Special Capital Region of Jakarta',
    routeBadge: 'BRT Corridor 1',
    materials: [
      'Activated Electronic Money Card (e-Money / Flazz / Brizzi / TapCash / JakLingko)',
      'Minimum balance of Rp5.000',
      'Comfortable footwear and face mask (if feeling unwell)'
    ],
    steps: [
      {
        number: 1,
        heading: 'Check Card Balance Prior to Entering',
        detail: 'Ensure your electronic payment card holds a balance of at least Rp5.000. Balance checks can be conducted at convenience stores, mobile banking apps, or the balance checker terminal outside the halte.'
      },
      {
        number: 2,
        heading: 'Access the Halte via Safe Crossings',
        detail: 'Enter the elevated or roadside bus stop (halte) exclusively through designated pedestrian bridges (JPO) or signalized pelican crossings. Never cross directly over the segregated busway lanes.'
      },
      {
        number: 3,
        heading: 'Tap-In at the Automatic Turnstile Gate',
        detail: 'Hold your card steadily against the contactless reader on top of the turnstile barrier. Wait for the green indicator light and audible chime before walking through the rotating barrier.'
      },
      {
        number: 4,
        heading: 'Queue Behind the Yellow Platform Safety Line',
        detail: 'Proceed to the platform gate designated for your desired route corridor. Stand patiently behind the yellow safety line and queue orderly in two rows flanking the automatic glass doors.'
      },
      {
        number: 5,
        heading: 'Prioritize Alighting Passengers and Board Mindfully',
        detail: 'When the bus arrives and the platform doors slide open, allow all alighting passengers to exit completely before stepping onto the bus. Watch your step to mind the platform gap.'
      },
      {
        number: 6,
        heading: 'Tap-Out at the Destination Halte Turnstile',
        detail: 'Upon reaching your destination stop, alight carefully and proceed to the exit turnstile. Tap your card once more to deduct the trip fare (Rp3.500) and unlock the exit gate.'
      }
    ],
    importantNotice: 'Note: Failure to tap out at your destination halte may result in your card being locked or charged a penalty fare on your subsequent trip.'
  },
  questions: [
    {
      id: 's1_q1_seq',
      type: 'drag_drop_sequence',
      competency: 'temporal_sequence',
      title: 'Bagian 1: Menyusun Urutan Prosedur (Drag & Drop Sequence)',
      instruction: 'Susunlah langkah-langkah acak berikut ke dalam urutan kronologis yang tepat sesuai teks prosedur "How to Board Transjakarta BRT"!',
      initialScrambledSteps: [
        { id: 'step_c', stepNumber: 3, text: 'Tap your electronic card on the entrance turnstile reader until the green light flashes.' },
        { id: 'step_a', stepNumber: 1, text: 'Verify that your electronic money card holds a minimum balance of Rp5.000.' },
        { id: 'step_e', stepNumber: 5, text: 'Allow alighting passengers to exit fully before mindfully stepping across the platform gap.' },
        { id: 'step_b', stepNumber: 2, text: 'Reach the elevated bus stop safely via the pedestrian overhead bridge (JPO).' },
        { id: 'step_d', stepNumber: 4, text: 'Queue patiently behind the yellow line flanking the automatic platform glass doors.' },
        { id: 'step_f', stepNumber: 6, text: 'Tap out at the destination barrier to register trip completion and finalize the fare.' }
      ],
      correctOrderIds: ['step_a', 'step_b', 'step_c', 'step_d', 'step_e', 'step_f'],
      explanation: 'Urutan logis teks prosedur: (1) Periksa saldo kartu -> (2) Masuk halte via JPO -> (3) Tap-in pada gate masuk -> (4) Mengantre di belakang garis kuning -> (5) Dahulukan penumpang turun sebelum naik -> (6) Tap-out di gate keluar halte tujuan.'
    },
    {
      id: 's1_q2_single',
      type: 'mc_single',
      competency: 'structure_goal',
      title: 'Bagian 2: Soal TKA Pilihan Ganda Tunggal (Single Choice)',
      question: 'What is the primary communicative purpose of the procedure text above?',
      options: [
        { id: 'A', text: 'To persuade passengers to buy a new JakLingko card at the ticket vending machine.' },
        { id: 'B', text: 'To provide a step-by-step guideline on using the Transjakarta BRT system safely and correctly with an e-money card.' },
        { id: 'C', text: 'To explain the historical evolution and architectural layout of Jakarta’s elevated bus shelters.' },
        { id: 'D', text: 'To criticize commuters who fail to tap out their cards at the destination turnstile.' },
        { id: 'E', text: 'To report accident statistics occurring along the segregated busway corridor.' }
      ],
      correctAnswer: 'B',
      explanation: 'Teks prosedur bertujuan komunikatif untuk memberikan instruksi berurutan (to provide a step-by-step guideline) mengenai cara menaiki Transjakarta BRT dengan aman menggunakan kartu uang elektronik.'
    },
    {
      id: 's1_q3_multi',
      type: 'mc_multiple',
      competency: 'imperative_language',
      title: 'Bagian 3: Soal TKA Pilihan Ganda Kompleks (Multiple Select)',
      question: 'Based on the text, which actions represent mandatory safety and compliance rules for passengers? (Pilih DUA (2) opsi yang benar)',
      minSelections: 2,
      maxSelections: 2,
      instructionText: 'Pilih tepat 2 (dua) jawaban yang benar:',
      options: [
        { id: 'opt_1', text: 'Cross directly through the busway lanes if the pedestrian bridge is crowded.' },
        { id: 'opt_2', text: 'Queue in two rows flanking the automatic doors behind the yellow safety platform line.' },
        { id: 'opt_3', text: 'Board the bus immediately without waiting for arriving passengers to step off.' },
        { id: 'opt_4', text: 'Tap out at the destination gate to prevent penalty charges and card blockage on the next trip.' },
        { id: 'opt_5', text: 'Carry a cash amount of Rp3.500 inside the bus to hand directly to the driver.' }
      ],
      correctAnswers: ['opt_2', 'opt_4'],
      explanation: 'Opsi yang sesuai dengan instruksi keselamatan: Mengantre di belakang garis kuning (opt_2) dan melakukan tap-out di halte tujuan agar kartu tidak terblokir atau terkena denda penalti (opt_4). Menyeberang langsung jalur busway dan naik mendahului penumpang turun sangat dilarang.'
    },
    {
      id: 's1_q4_cat',
      type: 'categorized_mc',
      competency: 'inference_troubleshoot',
      title: 'Bagian 4: Soal TKA Menjodohkan / Kategorik (Categorized Table)',
      question: 'Tentukan apakah setiap pernyataan berikut "Sesuai" atau "Tidak Sesuai" dengan isi dan implikasi teks prosedur di atas!',
      categories: ['Sesuai', 'Tidak Sesuai'],
      statements: [
        {
          id: 'stmt_1',
          statement: 'A passenger with a card balance of Rp3.000 will be permitted to pass through the entrance turnstile because the flat fare is only Rp3.500.',
          correctCategory: 'Tidak Sesuai',
          explanation: 'Tidak Sesuai: Langkah 1 secara tegas menyatakan saldo minimum yang harus dimiliki kartu sebelum masuk adalah Rp5.000.'
        },
        {
          id: 'stmt_2',
          statement: 'Passengers are expected to enter the halte strictly through JPO or signalized pelican crossings rather than jaywalking on the busway.',
          correctCategory: 'Sesuai',
          explanation: 'Sesuai: Langkah 2 secara eksplisit menginstruksikan penggunaan JPO atau pelican crossing demi keselamatan.'
        },
        {
          id: 'stmt_3',
          statement: 'The turnstile unlocks only after the contactless reader emits a green light and an audible chime.',
          correctCategory: 'Sesuai',
          explanation: 'Sesuai: Disebutkan pada langkah 3: "Wait for the green indicator light and audible chime before walking through".'
        },
        {
          id: 'stmt_4',
          statement: 'Skipping the tap-out process at the destination halte has no consequence if the passenger has already paid at tap-in.',
          correctCategory: 'Tidak Sesuai',
          explanation: 'Tidak Sesuai: Catatan penting (Important Notice) menyatakan kegagalan tap-out dapat menyebabkan kartu terblokir atau dikenakan penalti pada perjalanan berikutnya.'
        }
      ]
    }
  ]
};

// Stage 2 - Advanced (HOTS Tier): For students with Stage 1 >= 75%
export const STAGE_2_ADVANCED: StageContent = {
  stageId: 2,
  tier: 'advanced_hots',
  tierLabel: 'Stage 2: Advanced Transit Master (HOTS Level)',
  badge: 'Interchange Hub · Harmoni / Monas Central Transit',
  readingPassage: {
    title: 'How to Execute Seamless Multi-Corridor Transit & Integrated Fare Transfers in Transjakarta',
    subtitle: 'High-Order Procedural Protocols for Navigating Central Transit Interchange Hubs',
    routeBadge: 'Harmoni / Monas Junction',
    materials: [
      'JakLingko-integrated smart card or e-Wallet linked transit QR',
      'Digital Transit Map / TJ Navigation App',
      'Time allowance within the 180-minute integrated tariff window'
    ],
    steps: [
      {
        number: 1,
        heading: 'Identify the Designated Transfer Platform Upon Alighting',
        detail: 'Upon alighting at the central transit hub (such as Monas or CSW ASEAN), do NOT proceed toward the exit turnstiles. Locate overhead directional signage (wayfinding signage) to identify your connecting corridor platform.'
      },
      {
        number: 2,
        heading: 'Navigate the Internal Connecting Skybridge / Concourse',
        detail: 'Utilize the enclosed paid-area pedestrian walkway or elevators. Because you remain inside the paid fare zone, avoid tapping your card at any intermediary perimeter gates, which would falsely terminate your trip.'
      },
      {
        number: 3,
        heading: 'Verify Bus Headway and Real-Time Route Displays',
        detail: 'Inspect the Passenger Information System (PIS) digital LED boards overhead. Confirm that the approaching vehicle operates the exact destination code (e.g., Corridor 1A to PIK vs Corridor 1 to Kota).'
      },
      {
        number: 4,
        heading: 'Board via the Color-Coded Transit Gate',
        detail: 'Position yourself at the designated colored platform gate (Blue for standard BRT, Green for Royaltrans, Orange for Non-BRT feeders). Yield to alighting commuters before boarding.'
      },
      {
        number: 5,
        heading: 'Manage Integrated Fare Window (180-Minute Rule)',
        detail: 'If switching to an integrated Microtrans (JakLingko angkot) or MRT/LRT Jakarta within the Rp10.000 max tariff cap, complete your final tap within 180 minutes of your initial tap-in.'
      },
      {
        number: 6,
        heading: 'Conclude Journey at the Final Gate via Single Tap-Out',
        detail: 'Tap out strictly at the final destination exit gate. The automated ticketing algorithm computes the integrated fare, ensuring you are not double-charged for intermediary corridor transfers.'
      }
    ],
    importantNotice: 'Critical HOTS Note: Tapping out inside a transit transfer hub breaks the continuous journey chain, forcing you to pay an additional full fare upon re-entering.'
  },
  questions: [
    {
      id: 's2_adv_q1_seq',
      type: 'drag_drop_sequence',
      competency: 'temporal_sequence',
      title: 'Bagian 1: Menyusun Urutan Prosedur Kompleks (HOTS Sequence)',
      instruction: 'Susunlah tahapan transit multi-koridor berikut ke dalam urutan operasional yang tepat!',
      initialScrambledSteps: [
        { id: 'adv_step_b', stepNumber: 2, text: 'Traverse the enclosed paid-area concourse without passing through any exit barriers.' },
        { id: 'adv_step_e', stepNumber: 5, text: 'Ensure your subsequent connecting trip taps occur within the 180-minute tariff window.' },
        { id: 'adv_step_a', stepNumber: 1, text: 'Alight at the interchange hub and locate overhead directional wayfinding boards.' },
        { id: 'adv_step_d', stepNumber: 4, text: 'Queue and board at the designated color-coded platform gate after passengers alight.' },
        { id: 'adv_step_c', stepNumber: 3, text: 'Check the overhead Passenger Information System (PIS) display for vehicle destination codes.' },
        { id: 'adv_step_f', stepNumber: 6, text: 'Perform a single final tap-out at your ultimate destination halte to settle the integrated tariff.' }
      ],
      correctOrderIds: ['adv_step_a', 'adv_step_b', 'adv_step_c', 'adv_step_d', 'adv_step_e', 'adv_step_f'],
      explanation: 'Urutan transit: (1) Turun di hub & amati plang petunjuk -> (2) Lewati jembatan penghubung area berbayar tanpa tap-out -> (3) Pantau layar PIS -> (4) Antre di gate berwarna -> (5) Jaga jendela waktu 180 menit -> (6) Tap-out akhir di tujuan.'
    },
    {
      id: 's2_adv_q2_single',
      type: 'mc_single',
      competency: 'inference_troubleshoot',
      title: 'Bagian 2: Soal TKA HOTS Pilihan Ganda Tunggal (Deep Inference)',
      question: 'What is the most severe operational error a commuter can commit during an interchange at a central transit hub like CSW or Monas, based on the text?',
      options: [
        { id: 'A', text: 'Checking the Passenger Information System (PIS) board too frequently.' },
        { id: 'B', text: 'Tapping out at an intermediary perimeter gate while inside the transit concourse, thereby breaking the paid-area trip continuity.' },
        { id: 'C', text: 'Walking on the enclosed connecting skybridge instead of taking the elevator.' },
        { id: 'D', text: 'Choosing a blue-coded platform rather than an orange-coded feeder gate.' },
        { id: 'E', text: 'Boarding the connecting vehicle while listening to audio announcements.' }
      ],
      correctAnswer: 'B',
      explanation: 'Teks secara tegas memperingatkan: "avoid tapping your card at any intermediary perimeter gates, which would falsely terminate your trip" dan "Tapping out inside a transit transfer hub breaks the continuous journey chain, forcing you to pay an additional full fare".'
    },
    {
      id: 's2_adv_q3_multi',
      type: 'mc_multiple',
      competency: 'structure_goal',
      title: 'Bagian 3: Soal TKA HOTS Pilihan Ganda Kompleks (Analytical Multi-Select)',
      question: 'Which of the following conditions MUST be fulfilled for a commuter to benefit from the maximum Rp10.000 integrated JakLingko multi-modal tariff? (Pilih DUA (2) jawaban yang tepat)',
      minSelections: 2,
      maxSelections: 2,
      instructionText: 'Pilih tepat 2 (dua) opsi yang benar:',
      options: [
        { id: 'h_1', text: 'The commuter must utilize a JakLingko-integrated smart card or linked transit QR code.' },
        { id: 'h_2', text: 'The commuter must tap out and re-enter each bus halte to reset the trip timer.' },
        { id: 'h_3', text: 'The entire multi-modal journey must be completed within a 180-minute window from the initial tap-in.' },
        { id: 'h_4', text: 'The commuter must exclusively travel during off-peak weekend hours.' },
        { id: 'h_5', text: 'The passenger must carry exact physical cash for the bus conductor.' }
      ],
      correctAnswers: ['h_1', 'h_3'],
      explanation: 'Dua syarat utama tarif integrasi JakLingko (maksimal Rp10.000) adalah: menggunakan kartu/tiket berbasis JakLingko (h_1) dan menyelesaikan seluruh tap perpindahan moda dalam batas waktu 180 menit sejak tap pertama (h_3).'
    },
    {
      id: 's2_adv_q4_cat',
      type: 'categorized_mc',
      competency: 'imperative_language',
      title: 'Bagian 4: Soal TKA HOTS Kategorik (Evaluative Statement Verification)',
      question: 'Evaluasi kebenaran klaim analisis berikut berdasarkan teks prosedur transit Transjakarta:',
      categories: ['Sesuai', 'Tidak Sesuai'],
      statements: [
        {
          id: 'adv_s1',
          statement: 'Subtle differences in destination codes (such as Corridor 1A versus Corridor 1) on the PIS display could lead an inattentive commuter to an unintended final station.',
          correctCategory: 'Sesuai',
          explanation: 'Sesuai: Disebutkan pada langkah 3 bahwa penumpang harus mengonfirmasi kode destinasi pada layar PIS (misal 1A ke PIK vs 1 ke Kota).'
        },
        {
          id: 'adv_s2',
          statement: 'Commuters must perform a tap-in and tap-out cycle inside the connecting skybridge every time they change floors.',
          correctCategory: 'Tidak Sesuai',
          explanation: 'Tidak Sesuai: Penumpang tetap berada di zona berbayar (paid fare zone) sehingga dilarang men-tap kartu pada gate perantara.'
        },
        {
          id: 'adv_s3',
          statement: 'The color-coding system at platform gates serves to differentiate service categories (such as BRT trunk routes versus non-BRT feeders).',
          correctCategory: 'Sesuai',
          explanation: 'Sesuai: Disebutkan pada langkah 4: "Blue for standard BRT, Green for Royaltrans, Orange for Non-BRT feeders".'
        },
        {
          id: 'adv_s4',
          statement: 'If a transfer journey exceeds 180 minutes, the automated system still guarantees the locked flat rate of Rp3.500 across all subsequent transit modes.',
          correctCategory: 'Tidak Sesuai',
          explanation: 'Tidak Sesuai: Tarif integrasi Rp10.000 hanya berlaku jika tap terakhir diselesaikan dalam batas jendela 180 menit.'
        }
      ]
    }
  ]
};

// Stage 2 - Foundation (Mastery Tier): For students with Stage 1 < 75%
export const STAGE_2_FOUNDATION: StageContent = {
  stageId: 2,
  tier: 'foundation_mastery',
  tierLabel: 'Stage 2: Foundation & Procedural Mastery (Core Level)',
  badge: 'Halte Ticket Machine · Vending Terminal',
  readingPassage: {
    title: 'How to Top Up an Electronic Money Card at a Transjakarta Halte Vending Machine',
    subtitle: 'Clear Step-by-Step Instructions for Using Automated Halte Ticket Terminals',
    routeBadge: 'Ticket Vending Machine',
    materials: [
      'Electronic Money Card (e-Money / Flazz / Brizzi / TapCash)',
      'Bank notes (Rp20.000, Rp50.000, or Rp100.000 in crisp condition) or QRIS app',
      'Active mobile screen for QR payment'
    ],
    steps: [
      {
        number: 1,
        heading: 'Locate the Ticket Vending Machine (Mesin Otomatis)',
        detail: 'Walk toward the automated blue-and-white Ticket Vending Machine (TVM) situated near the entrance barrier before the turnstile gates.'
      },
      {
        number: 2,
        heading: 'Place Your Card onto the Designated Card Reader Slot',
        detail: 'Lay your card flat on the transparent card reader panel. Do not move or take away the card until the entire transaction is finished.'
      },
      {
        number: 3,
        heading: 'Select "Top Up" on the Touchscreen Display',
        detail: 'Tap the "Top Up Saldo" icon on the main menu screen. The monitor will immediately show your card serial number and your current remaining balance.'
      },
      {
        number: 4,
        heading: 'Choose the Desired Top-Up Amount and Payment Method',
        detail: 'Select your preferred nominal amount (e.g., Rp20.000, Rp50.000). Then choose your payment method: "Cash" (Uang Tunai) or "QRIS Scan".'
      },
      {
        number: 5,
        heading: 'Insert Cash into the Bill Slot or Scan the QR Code',
        detail: 'If paying cash, insert uncreased banknotes one by one into the flashing bill acceptor. If using QRIS, scan the dynamic QR on your mobile banking app.'
      },
      {
        number: 6,
        heading: 'Wait for Confirmation and Retrieve Your Card',
        detail: 'Wait until the screen displays "Transaksi Berhasil" (Transaction Successful). Take your printed receipt and lift your card from the reader slot.'
      }
    ],
    importantNotice: 'Warning: Removing your card before the green success screen appears may interrupt the data writing process and corrupt your balance update.'
  },
  questions: [
    {
      id: 's2_fnd_q1_seq',
      type: 'drag_drop_sequence',
      competency: 'temporal_sequence',
      title: 'Bagian 1: Menyusun Urutan Prosedur Top-Up (Step Sequencing)',
      instruction: 'Susunlah langkah-langkah pengisian saldo kartu di bawah ini menjadi urutan yang benar!',
      initialScrambledSteps: [
        { id: 'fnd_step_b', stepNumber: 2, text: 'Lay your electronic card flat onto the designated transparent reader slot.' },
        { id: 'fnd_step_e', stepNumber: 5, text: 'Insert uncreased banknotes into the bill slot or scan the generated QRIS code.' },
        { id: 'fnd_step_a', stepNumber: 1, text: 'Find and approach the automated Ticket Vending Machine near the halte entrance.' },
        { id: 'fnd_step_c', stepNumber: 3, text: 'Touch the "Top Up Saldo" button on the screen to view your current balance.' },
        { id: 'fnd_step_f', stepNumber: 6, text: 'Wait for the "Transaksi Berhasil" notification before taking your card and receipt.' },
        { id: 'fnd_step_d', stepNumber: 4, text: 'Choose your desired top-up nominal and select either Cash or QRIS payment.' }
      ],
      correctOrderIds: ['fnd_step_a', 'fnd_step_b', 'fnd_step_c', 'fnd_step_d', 'fnd_step_e', 'fnd_step_f'],
      explanation: 'Urutan tepat pengisian saldo di mesin otomatis: (1) Dekati mesin -> (2) Letakkan kartu di slot reader -> (3) Pilih "Top Up Saldo" -> (4) Pilih nominal & metode bayar -> (5) Masukkan uang / scan QRIS -> (6) Tunggu konfirmasi sukses baru ambil kartu.'
    },
    {
      id: 's2_fnd_q2_single',
      type: 'mc_single',
      competency: 'imperative_language',
      title: 'Bagian 2: Soal TKA Pilihan Ganda Tunggal (Linguistic Feature - Imperative Verbs)',
      question: 'Which imperative verb phrase in the text cautions the user against premature action that could cause transaction failure?',
      options: [
        { id: 'A', text: '"Walk toward the automated machine"' },
        { id: 'B', text: '"Do not move or take away the card until the transaction is finished"' },
        { id: 'C', text: '"Choose your preferred nominal amount"' },
        { id: 'D', text: '"Scan the dynamic QR on your mobile banking app"' },
        { id: 'E', text: '"Take your printed receipt from the tray"' }
      ],
      correctAnswer: 'B',
      explanation: 'Kalimat imperatif negatif "Do not move or take away the card until the transaction is finished" memperingatkan pengguna agar tidak mengangkat kartu sebelum transaksi tuntas untuk mencegah kegagalan penulisan chip kartu.'
    },
    {
      id: 's2_fnd_q3_multi',
      type: 'mc_multiple',
      competency: 'structure_goal',
      title: 'Bagian 3: Soal TKA Pilihan Ganda Kompleks (Detail Comprehension)',
      question: 'Which of the following items are listed as required materials or instruments to complete the top-up procedure? (Pilih DUA (2) opsi yang benar)',
      minSelections: 2,
      maxSelections: 2,
      instructionText: 'Pilih tepat 2 (dua) opsi yang benar:',
      options: [
        { id: 'fnd_mat_1', text: 'An active Electronic Money Card (e.g., e-Money, Flazz, Brizzi, TapCash)' },
        { id: 'fnd_mat_2', text: 'A valid passport and immigration transit stamp' },
        { id: 'fnd_mat_3', text: 'Uncreased bank notes (Rp20.000 / Rp50.000 / Rp100.000) or active QRIS smartphone app' },
        { id: 'fnd_mat_4', text: 'A physical screwdriver to calibrate the bill acceptor slot' },
        { id: 'fnd_mat_5', text: 'A pre-printed complaint letter addressed to Transjakarta management' }
      ],
      correctAnswers: ['fnd_mat_1', 'fnd_mat_3'],
      explanation: 'Bahan/alat yang dibutuhkan untuk top-up sesuai bagian Materials: Kartu Uang Elektronik (fnd_mat_1) dan Uang tunai kertas rapi atau aplikasi pembayaran QRIS (fnd_mat_3).'
    },
    {
      id: 's2_fnd_q4_cat',
      type: 'categorized_mc',
      competency: 'inference_troubleshoot',
      title: 'Bagian 4: Soal TKA Menjodohkan / Kategorik (True / False Classification)',
      question: 'Tentukan apakah pernyataan berikut "Sesuai" atau "Tidak Sesuai" dengan petunjuk pengoperasian mesin tiket otomatis:',
      categories: ['Sesuai', 'Tidak Sesuai'],
      statements: [
        {
          id: 'fnd_s1',
          statement: 'The touch monitor automatically displays the card serial number and current balance immediately after the user taps "Top Up Saldo".',
          correctCategory: 'Sesuai',
          explanation: 'Sesuai: Tertulis pada langkah 3: "The monitor will immediately show your card serial number and your current remaining balance".'
        },
        {
          id: 'fnd_s2',
          statement: 'Crumpled or torn bank notes are recommended to test the machine sensor tolerance.',
          correctCategory: 'Tidak Sesuai',
          explanation: 'Tidak Sesuai: Teks mensyaratkan uang kertas yang rapi dan tidak lusuh (uncreased banknotes) agar dapat diterima oleh slot mesin.'
        },
        {
          id: 'fnd_s3',
          statement: 'Users can safely remove their electronic card as soon as the banknotes are inserted into the machine slot.',
          correctCategory: 'Tidak Sesuai',
          explanation: 'Tidak Sesuai: Catatan peringatan (Warning) menegaskan bahwa mencabut kartu sebelum layar konfirmasi sukses dapat mengacaukan proses pengisian saldo.'
        },
        {
          id: 'fnd_s4',
          statement: 'QRIS payment is available as an alternative method for commuters who do not carry physical cash.',
          correctCategory: 'Sesuai',
          explanation: 'Sesuai: Langkah 4 & 5 dengan jelas mencantumkan opsi QRIS scan melalui aplikasi mobile banking.'
        }
      ]
    }
  ]
};
