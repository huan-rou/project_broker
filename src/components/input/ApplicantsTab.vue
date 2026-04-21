<script setup lang="ts">
import { useInputStore } from '../../stores/input'
import { MaritalStatus } from '../../types'

const store = useInputStore()
const statusOptions = Object.values(MaritalStatus)

// Postcode-to-location mapping for display
const postcodeLocationMap: Record<string, string> = {
  '2000': 'Sydney', '2001': 'Sydney', '2010': 'Sydney', '2011': 'Sydney', '2015': 'Sydney',
  '2020': 'Sydney', '2021': 'Sydney', '2025': 'Sydney', '2026': 'Sydney', '2027': 'Sydney',
  '2028': 'Sydney', '2029': 'Sydney', '2030': 'Sydney', '2031': 'Sydney', '2032': 'Sydney',
  '2033': 'Sydney', '2034': 'Sydney', '2035': 'Sydney', '2036': 'Sydney', '2037': 'Sydney',
  '2038': 'Sydney', '2039': 'Sydney', '2040': 'Sydney', '2041': 'Sydney', '2042': 'Sydney',
  '2043': 'Sydney', '2044': 'Sydney', '2045': 'Sydney', '2046': 'Sydney', '2047': 'Sydney',
  '2048': 'Sydney', '2049': 'Sydney', '2050': 'Sydney', '2055': 'Sydney', '2059': 'Sydney',
  '2060': 'Sydney', '2061': 'Sydney', '2062': 'Sydney', '2063': 'Sydney', '2064': 'Sydney',
  '2065': 'Sydney', '2066': 'Sydney', '2067': 'Sydney', '2068': 'Sydney', '2069': 'Sydney',
  '2070': 'Sydney', '2071': 'Sydney', '2072': 'Sydney', '2073': 'Sydney', '2074': 'Sydney',
  '2075': 'Sydney', '2076': 'Sydney', '2077': 'Sydney', '2085': 'Sydney', '2086': 'Sydney',
  '2087': 'Sydney', '2088': 'Sydney', '2089': 'Sydney', '2090': 'Sydney', '2092': 'Sydney',
  '2093': 'Sydney', '2094': 'Sydney', '2095': 'Sydney', '2096': 'Sydney', '2097': 'Sydney',
  '2099': 'Sydney', '2100': 'Sydney', '2101': 'Sydney', '2102': 'Sydney', '2103': 'Sydney',
  '2104': 'Sydney', '2105': 'Sydney', '2106': 'Sydney', '2107': 'Sydney', '2108': 'Sydney',
  '2110': 'Sydney', '2111': 'Sydney', '2112': 'Sydney', '2113': 'Sydney', '2114': 'Sydney',
  '2115': 'Sydney', '2116': 'Sydney', '2117': 'Sydney', '2118': 'Sydney', '2119': 'Sydney',
  '2120': 'Sydney', '2121': 'Sydney', '2122': 'Sydney', '2125': 'Sydney', '2126': 'Sydney',
  '2127': 'Sydney', '2128': 'Sydney', '2130': 'Sydney', '2131': 'Sydney', '2132': 'Sydney',
  '2133': 'Sydney', '2134': 'Sydney', '2135': 'Sydney', '2136': 'Sydney', '2137': 'Sydney',
  '2138': 'Sydney', '2140': 'Sydney', '2141': 'Sydney', '2142': 'Sydney', '2143': 'Sydney',
  '2144': 'Sydney', '2145': 'Sydney', '2146': 'Sydney', '2147': 'Sydney', '2148': 'Sydney',
  '2150': 'Sydney', '2151': 'Sydney', '2152': 'Sydney', '2153': 'Sydney', '2154': 'Sydney',
  '2155': 'Sydney', '2160': 'Sydney', '2161': 'Sydney', '2162': 'Sydney', '2163': 'Sydney',
  '2164': 'Sydney', '2165': 'Sydney', '2166': 'Sydney', '2167': 'Sydney', '2168': 'Sydney',
  '2170': 'Sydney', '2171': 'Sydney', '2172': 'Sydney', '2173': 'Sydney', '2174': 'Sydney',
  '2175': 'Sydney', '2176': 'Sydney', '2177': 'Sydney', '2178': 'Sydney', '2179': 'Sydney',
  '2190': 'Sydney', '2191': 'Sydney', '2192': 'Sydney', '2193': 'Sydney', '2194': 'Sydney',
  '2195': 'Sydney', '2196': 'Sydney', '2197': 'Sydney', '2198': 'Sydney', '2199': 'Sydney',
  '2200': 'Sydney', '2203': 'Sydney', '2204': 'Sydney', '2205': 'Sydney', '2206': 'Sydney',
  '2207': 'Sydney', '2208': 'Sydney', '2209': 'Sydney', '2210': 'Sydney', '2211': 'Sydney',
  '2212': 'Sydney', '2213': 'Sydney', '2214': 'Sydney', '2216': 'Sydney', '2217': 'Sydney',
  '2218': 'Sydney', '2219': 'Sydney', '2220': 'Sydney', '2221': 'Sydney', '2222': 'Sydney',
  '2223': 'Sydney', '2224': 'Sydney', '2225': 'Sydney', '2226': 'Sydney', '2227': 'Sydney',
  '2228': 'Sydney', '2229': 'Sydney', '2230': 'Sydney', '2231': 'Sydney', '2232': 'Sydney',
  '2233': 'Sydney', '2234': 'Sydney',
  '3000': 'Melbourne', '3001': 'Melbourne', '3002': 'Melbourne', '3003': 'Melbourne',
  '3004': 'Melbourne', '3005': 'Melbourne', '3006': 'Melbourne', '3008': 'Melbourne',
  '3010': 'Melbourne', '3011': 'Melbourne', '3012': 'Melbourne', '3013': 'Melbourne',
  '3015': 'Melbourne', '3016': 'Melbourne', '3018': 'Melbourne', '3019': 'Melbourne',
  '3020': 'Melbourne', '3021': 'Melbourne', '3022': 'Melbourne', '3023': 'Melbourne',
  '3024': 'Melbourne', '3025': 'Melbourne', '3028': 'Melbourne', '3029': 'Melbourne',
  '3030': 'Melbourne', '3031': 'Melbourne', '3032': 'Melbourne', '3033': 'Melbourne',
  '3034': 'Melbourne', '3036': 'Melbourne', '3037': 'Melbourne', '3038': 'Melbourne',
  '3039': 'Melbourne', '3040': 'Melbourne', '3041': 'Melbourne', '3042': 'Melbourne',
  '3043': 'Melbourne', '3044': 'Melbourne', '3046': 'Melbourne', '3047': 'Melbourne',
  '3048': 'Melbourne', '3049': 'Melbourne', '3050': 'Melbourne', '3051': 'Melbourne',
  '3052': 'Melbourne', '3053': 'Melbourne', '3054': 'Melbourne', '3055': 'Melbourne',
  '3056': 'Melbourne', '3057': 'Melbourne', '3058': 'Melbourne', '3059': 'Melbourne',
  '3060': 'Melbourne', '3061': 'Melbourne', '3062': 'Melbourne', '3064': 'Melbourne',
  '3065': 'Melbourne', '3066': 'Melbourne', '3067': 'Melbourne', '3068': 'Melbourne',
  '3070': 'Melbourne', '3071': 'Melbourne', '3072': 'Melbourne', '3073': 'Melbourne',
  '3074': 'Melbourne', '3075': 'Melbourne', '3076': 'Melbourne', '3078': 'Melbourne',
  '3079': 'Melbourne', '3081': 'Melbourne', '3082': 'Melbourne', '3083': 'Melbourne',
  '3084': 'Melbourne', '3085': 'Melbourne', '3086': 'Melbourne', '3087': 'Melbourne',
  '3088': 'Melbourne', '3089': 'Melbourne', '3090': 'Melbourne', '3091': 'Melbourne',
  '3093': 'Melbourne', '3094': 'Melbourne', '3095': 'Melbourne', '3096': 'Melbourne',
  '3097': 'Melbourne', '3101': 'Melbourne', '3102': 'Melbourne', '3103': 'Melbourne',
  '3104': 'Melbourne', '3105': 'Melbourne', '3106': 'Melbourne', '3107': 'Melbourne',
  '3108': 'Melbourne', '3109': 'Melbourne', '3111': 'Melbourne', '3113': 'Melbourne',
  '3114': 'Melbourne', '3115': 'Melbourne', '3116': 'Melbourne', '3121': 'Melbourne',
  '3122': 'Melbourne', '3123': 'Melbourne', '3124': 'Melbourne', '3125': 'Melbourne',
  '3126': 'Melbourne', '3127': 'Melbourne', '3128': 'Melbourne', '3129': 'Melbourne',
  '3130': 'Melbourne', '3131': 'Melbourne', '3132': 'Melbourne', '3133': 'Melbourne',
  '3134': 'Melbourne', '3135': 'Melbourne', '3136': 'Melbourne', '3137': 'Melbourne',
  '3138': 'Melbourne', '3140': 'Melbourne', '3141': 'Melbourne', '3142': 'Melbourne',
  '3143': 'Melbourne', '3144': 'Melbourne', '3145': 'Melbourne', '3146': 'Melbourne',
  '3147': 'Melbourne', '3148': 'Melbourne', '3149': 'Melbourne', '3150': 'Melbourne',
  '3151': 'Melbourne', '3152': 'Melbourne', '3153': 'Melbourne', '3154': 'Melbourne',
  '3155': 'Melbourne', '3156': 'Melbourne', '3158': 'Melbourne', '3160': 'Melbourne',
  '3161': 'Melbourne', '3162': 'Melbourne', '3163': 'Melbourne', '3165': 'Melbourne',
  '3166': 'Melbourne', '3167': 'Melbourne', '3168': 'Melbourne', '3169': 'Melbourne',
  '3170': 'Melbourne', '3171': 'Melbourne', '3172': 'Melbourne', '3173': 'Melbourne',
  '3174': 'Melbourne', '3175': 'Melbourne', '3176': 'Melbourne', '3177': 'Melbourne',
  '3178': 'Melbourne', '3179': 'Melbourne', '3180': 'Melbourne', '3181': 'Melbourne',
  '3182': 'Melbourne', '3183': 'Melbourne', '3184': 'Melbourne', '3185': 'Melbourne',
  '3186': 'Melbourne', '3187': 'Melbourne', '3188': 'Melbourne', '3189': 'Melbourne',
  '3190': 'Melbourne', '3191': 'Melbourne', '3192': 'Melbourne', '3193': 'Melbourne',
  '3194': 'Melbourne', '3195': 'Melbourne', '3196': 'Melbourne', '3197': 'Melbourne',
  '3198': 'Melbourne', '3199': 'Melbourne', '3200': 'Melbourne', '3201': 'Melbourne',
  '3202': 'Melbourne', '3204': 'Melbourne', '3205': 'Melbourne', '3206': 'Melbourne',
  '3207': 'Melbourne',
  '4000': 'Brisbane', '4001': 'Brisbane', '4005': 'Brisbane', '4006': 'Brisbane',
  '4007': 'Brisbane', '4008': 'Brisbane', '4009': 'Brisbane', '4010': 'Brisbane',
  '4011': 'Brisbane', '4012': 'Brisbane', '4013': 'Brisbane', '4014': 'Brisbane',
  '4017': 'Brisbane', '4018': 'Brisbane', '4019': 'Brisbane', '4020': 'Brisbane',
  '4021': 'Brisbane', '4022': 'Brisbane', '4030': 'Brisbane', '4031': 'Brisbane',
  '4032': 'Brisbane', '4034': 'Brisbane', '4035': 'Brisbane', '4036': 'Brisbane',
  '4037': 'Brisbane', '4051': 'Brisbane', '4053': 'Brisbane', '4054': 'Brisbane',
  '4055': 'Brisbane', '4059': 'Brisbane', '4060': 'Brisbane', '4061': 'Brisbane',
  '4064': 'Brisbane', '4065': 'Brisbane', '4066': 'Brisbane', '4067': 'Brisbane',
  '4068': 'Brisbane', '4069': 'Brisbane', '4070': 'Brisbane', '4072': 'Brisbane',
  '4073': 'Brisbane', '4074': 'Brisbane', '4075': 'Brisbane', '4076': 'Brisbane',
  '4077': 'Brisbane', '4078': 'Brisbane', '4101': 'Brisbane', '4102': 'Brisbane',
  '4103': 'Brisbane', '4104': 'Brisbane', '4105': 'Brisbane', '4106': 'Brisbane',
  '4107': 'Brisbane', '4108': 'Brisbane', '4109': 'Brisbane', '4110': 'Brisbane',
  '4111': 'Brisbane', '4112': 'Brisbane', '4113': 'Brisbane', '4114': 'Brisbane',
  '4115': 'Brisbane', '4116': 'Brisbane', '4117': 'Brisbane', '4118': 'Brisbane',
  '4119': 'Brisbane', '4120': 'Brisbane', '4121': 'Brisbane', '4122': 'Brisbane',
  '4151': 'Brisbane', '4152': 'Brisbane', '4153': 'Brisbane', '4154': 'Brisbane',
  '4155': 'Brisbane', '4156': 'Brisbane', '4157': 'Brisbane', '4158': 'Brisbane',
  '4159': 'Brisbane', '4160': 'Brisbane', '4161': 'Brisbane', '4163': 'Brisbane',
  '4164': 'Brisbane', '4165': 'Brisbane', '4169': 'Brisbane', '4170': 'Brisbane',
  '4171': 'Brisbane', '4172': 'Brisbane', '4173': 'Brisbane', '4174': 'Brisbane',
  '4178': 'Brisbane', '4179': 'Brisbane',
  '6000': 'Perth', '6003': 'Perth', '6004': 'Perth', '6005': 'Perth',
  '6006': 'Perth', '6007': 'Perth', '6008': 'Perth', '6009': 'Perth',
  '6010': 'Perth', '6011': 'Perth', '6012': 'Perth', '6014': 'Perth',
  '6015': 'Perth', '6016': 'Perth', '6017': 'Perth', '6018': 'Perth',
  '6019': 'Perth', '6020': 'Perth', '6021': 'Perth', '6022': 'Perth',
  '6023': 'Perth', '6024': 'Perth', '6025': 'Perth', '6026': 'Perth',
  '6027': 'Perth', '6028': 'Perth', '6029': 'Perth', '6030': 'Perth',
  '6031': 'Perth', '6032': 'Perth', '6033': 'Perth', '6034': 'Perth',
  '6035': 'Perth', '6036': 'Perth', '6050': 'Perth', '6051': 'Perth',
  '6052': 'Perth', '6053': 'Perth', '6054': 'Perth', '6055': 'Perth',
  '6056': 'Perth', '6057': 'Perth', '6058': 'Perth', '6059': 'Perth',
  '6060': 'Perth', '6061': 'Perth', '6062': 'Perth', '6063': 'Perth',
  '6064': 'Perth', '6065': 'Perth', '6066': 'Perth', '6067': 'Perth',
  '6068': 'Perth', '6069': 'Perth', '6070': 'Perth', '6071': 'Perth',
  '6072': 'Perth', '6073': 'Perth', '6074': 'Perth', '6076': 'Perth',
  '6077': 'Perth', '6078': 'Perth', '6079': 'Perth', '6081': 'Perth',
  '6082': 'Perth', '6083': 'Perth', '6084': 'Perth', '6090': 'Perth',
  '6100': 'Perth', '6101': 'Perth', '6102': 'Perth', '6103': 'Perth',
  '6104': 'Perth', '6105': 'Perth', '6106': 'Perth', '6107': 'Perth',
  '6108': 'Perth', '6109': 'Perth', '6110': 'Perth', '6111': 'Perth',
  '6112': 'Perth', '6147': 'Perth', '6148': 'Perth', '6149': 'Perth',
  '6150': 'Perth', '6151': 'Perth', '6152': 'Perth', '6153': 'Perth',
  '6154': 'Perth', '6155': 'Perth', '6156': 'Perth', '6157': 'Perth',
  '6158': 'Perth', '6159': 'Perth', '6160': 'Perth', '6162': 'Perth',
  '6163': 'Perth', '6164': 'Perth', '6165': 'Perth', '6166': 'Perth',
  '6167': 'Perth', '6168': 'Perth', '6169': 'Perth', '6170': 'Perth',
  '6171': 'Perth', '6172': 'Perth',
  '5000': 'Adelaide', '5001': 'Adelaide', '5005': 'Adelaide', '5006': 'Adelaide',
  '5007': 'Adelaide', '5008': 'Adelaide', '5009': 'Adelaide', '5010': 'Adelaide',
  '5011': 'Adelaide', '5012': 'Adelaide', '5013': 'Adelaide', '5014': 'Adelaide',
  '5015': 'Adelaide', '5016': 'Adelaide', '5017': 'Adelaide', '5018': 'Adelaide',
  '5019': 'Adelaide', '5020': 'Adelaide', '5021': 'Adelaide', '5022': 'Adelaide',
  '5023': 'Adelaide', '5024': 'Adelaide', '5025': 'Adelaide', '5031': 'Adelaide',
  '5032': 'Adelaide', '5033': 'Adelaide', '5034': 'Adelaide', '5035': 'Adelaide',
  '5037': 'Adelaide', '5038': 'Adelaide', '5039': 'Adelaide', '5040': 'Adelaide',
  '5041': 'Adelaide', '5042': 'Adelaide', '5043': 'Adelaide', '5044': 'Adelaide',
  '5045': 'Adelaide', '5046': 'Adelaide', '5047': 'Adelaide', '5048': 'Adelaide',
  '5049': 'Adelaide', '5050': 'Adelaide', '5051': 'Adelaide', '5052': 'Adelaide',
  '5061': 'Adelaide', '5062': 'Adelaide', '5063': 'Adelaide', '5064': 'Adelaide',
  '5065': 'Adelaide', '5066': 'Adelaide', '5067': 'Adelaide', '5068': 'Adelaide',
  '5069': 'Adelaide', '5070': 'Adelaide', '5071': 'Adelaide', '5072': 'Adelaide',
  '5073': 'Adelaide', '5074': 'Adelaide', '5075': 'Adelaide', '5076': 'Adelaide',
  '5081': 'Adelaide', '5082': 'Adelaide', '5083': 'Adelaide', '5084': 'Adelaide',
  '5085': 'Adelaide', '5086': 'Adelaide', '5087': 'Adelaide', '5088': 'Adelaide',
  '5089': 'Adelaide', '5090': 'Adelaide', '5091': 'Adelaide', '5092': 'Adelaide',
  '5093': 'Adelaide', '5094': 'Adelaide', '5095': 'Adelaide', '5096': 'Adelaide',
  '5097': 'Adelaide', '5098': 'Adelaide',
  '7000': 'Hobart', '7004': 'Hobart', '7005': 'Hobart', '7007': 'Hobart',
  '7008': 'Hobart', '7009': 'Hobart', '7010': 'Hobart', '7011': 'Hobart',
  '7012': 'Hobart', '7015': 'Hobart', '7016': 'Hobart', '7017': 'Hobart',
  '7018': 'Hobart', '7019': 'Hobart', '7020': 'Hobart', '7050': 'Hobart',
  '7051': 'Hobart', '7052': 'Hobart', '7053': 'Hobart', '7054': 'Hobart',
  '7055': 'Hobart',
  '0800': 'ACT & NT', '0810': 'ACT & NT', '0812': 'ACT & NT', '0820': 'ACT & NT',
  '0828': 'ACT & NT', '0829': 'ACT & NT', '0830': 'ACT & NT', '0832': 'ACT & NT',
  '2600': 'ACT & NT', '2601': 'ACT & NT', '2602': 'ACT & NT', '2603': 'ACT & NT',
  '2604': 'ACT & NT', '2605': 'ACT & NT', '2606': 'ACT & NT', '2607': 'ACT & NT',
  '2609': 'ACT & NT', '2611': 'ACT & NT', '2612': 'ACT & NT', '2614': 'ACT & NT',
  '2615': 'ACT & NT', '2617': 'ACT & NT', '2900': 'ACT & NT', '2902': 'ACT & NT',
  '2903': 'ACT & NT', '2904': 'ACT & NT', '2905': 'ACT & NT', '2906': 'ACT & NT',
  '2911': 'ACT & NT', '2912': 'ACT & NT', '2913': 'ACT & NT', '2914': 'ACT & NT',
}

function deriveLocation(postcode: string): string {
  if (!postcode || postcode.length < 4) return ''
  if (postcodeLocationMap[postcode]) return postcodeLocationMap[postcode]
  // Fallback by range
  const pc = parseInt(postcode)
  if (isNaN(pc)) return ''
  if (pc >= 2000 && pc <= 2234) return 'Sydney'
  if (pc >= 2235 && pc <= 2599) return 'Balance of NSW'
  if (pc >= 2600 && pc <= 2920) return 'ACT & NT'
  if (pc >= 2921 && pc <= 2999) return 'Balance of NSW'
  if (pc >= 3000 && pc <= 3207) return 'Melbourne'
  if (pc >= 3208 && pc <= 3999) return 'Balance of VIC'
  if (pc >= 4000 && pc <= 4179) return 'Brisbane'
  if (pc >= 4180 && pc <= 4999) return 'Balance of QLD'
  if (pc >= 5000 && pc <= 5098) return 'Adelaide'
  if (pc >= 5099 && pc <= 5999) return 'Balance of SA'
  if (pc >= 6000 && pc <= 6172) return 'Perth'
  if (pc >= 6173 && pc <= 6999) return 'Balance of WA'
  if (pc >= 7000 && pc <= 7055) return 'Hobart'
  if (pc >= 7056 && pc <= 7999) return 'Balance of TAS'
  if (pc >= 800 && pc <= 899) return 'ACT & NT'
  return 'Australia'
}

function onPostcodeChange(app: any) {
  app.location = deriveLocation(app.postcode)
}
</script>

<template>
  <div class="tab-section">
    <div class="section-header">
      <h3>Applicants</h3>
      <button v-if="store.applicants.length < 4" class="btn-sm btn-add" @click="store.addApplicant()">
        + Add Applicant
      </button>
    </div>

    <div v-for="(app, i) in store.applicants" :key="i" class="applicant-card">
      <div class="card-header">
        <strong>Applicant {{ i + 1 }}</strong>
        <button v-if="store.applicants.length > 1" class="btn-sm btn-danger" @click="store.removeApplicant(i)">
          Remove
        </button>
      </div>
      <div class="form-grid">
        <div class="field">
          <label>Name</label>
          <input v-model="app.name" />
        </div>
        <div class="field">
          <label>CCAS ID</label>
          <input v-model="app.ccas_id" />
        </div>
        <div class="field">
          <label>Status</label>
          <select v-model="app.status">
            <option :value="null">-- Select --</option>
            <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
        <div class="field" v-if="app.status === MaritalStatus.COUPLE || app.status === MaritalStatus.DE_FACTO">
          <label>Married to</label>
          <select v-model="app.married_to">
            <option value="">-- Select --</option>
            <option
              v-for="(other, j) in store.applicants"
              :key="j"
              :value="other.name"
              :disabled="j === i"
            >{{ other.name }}</option>
          </select>
        </div>
        <div class="field">
          <label>Dependents</label>
          <input v-model.number="app.dependents" type="number" min="0" />
        </div>
        <div class="field">
          <label>Postcode</label>
          <input
            v-model="app.postcode"
            placeholder="e.g. 2000"
            maxlength="4"
            @input="onPostcodeChange(app)"
          />
        </div>
        <div class="field" v-if="app.location">
          <label>Location (derived)</label>
          <div class="derived-value">{{ app.location }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-section h3 { margin: 0; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.applicant-card {
  border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin-bottom: 1rem;
}
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem; }
.field label { display: block; font-size: 0.8rem; color: #475569; margin-bottom: 0.2rem; font-weight: 500; }
.field input, .field select {
  width: 100%; padding: 0.4rem 0.5rem; border: 1px solid #cbd5e1; border-radius: 4px;
  font-size: 0.875rem; box-sizing: border-box;
}
.field input:focus, .field select:focus { outline: none; border-color: #2563eb; }
.derived-value {
  padding: 0.4rem 0.5rem; background: #f1f5f9; border-radius: 4px;
  font-size: 0.875rem; color: #334155; border: 1px solid #e2e8f0;
}
.btn-sm { padding: 0.25rem 0.625rem; font-size: 0.75rem; border-radius: 4px; cursor: pointer; border: none; }
.btn-add { background: #dbeafe; color: #1e40af; }
.btn-add:hover { background: #bfdbfe; }
.btn-danger { background: #fee2e2; color: #dc2626; }
.btn-danger:hover { background: #fecaca; }
</style>
