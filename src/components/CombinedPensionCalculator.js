import React, { useState, useEffect } from 'react';

const CombinedPensionCalculator = () => {
  const [calculatorType, setCalculatorType] = useState('yearly'); // 'yearly' 또는 'longterm'
  
  // 공통 입력 상태
  const [annualIncome, setAnnualIncome] = useState(5000);
  const [age, setAge] = useState(35);
  const [pensionSaving, setPensionSaving] = useState(600);
  const [irpDeposit, setIrpDeposit] = useState(300);
  const [isaDeposit, setIsaDeposit] = useState(1000);
  const [isaType, setIsaType] = useState('normal');
  
  // 수익률 설정
  const [generalReturnRate, setGeneralReturnRate] = useState(5); // 일반 투자 수익률
  const [isaReturnRate, setIsaReturnRate] = useState(5); // ISA 특화 수익률
  const [inflationRate, setInflationRate] = useState(2); // 인플레이션 비율
  
  // 장기 계산기 추가 입력 상태
  const [contributionYears, setContributionYears] = useState(20); // 납입 기간
  const [retirementAge, setRetirementAge] = useState(55); // 은퇴 연령
  const [withdrawalPeriod, setWithdrawalPeriod] = useState(30); // 연금 수령 기간
  const [withdrawalType, setWithdrawalType] = useState('annuity'); // 'annuity' 또는 'lumpsum'
  const [reinvestRate, setReinvestRate] = useState(4); // 세제혜택 재투자 수익률
  
  return (
    <div className="p-4 max-w-6xl mx-auto bg-white">
      <h1 className="text-3xl font-bold text-center mb-6">종합 연금 및 세제혜택 계산기</h1>
      
      <div className="flex mb-4 bg-gray-100 rounded-lg">
        <button 
          className={`flex-1 py-3 rounded-l-lg font-medium ${calculatorType === 'yearly' ? 'bg-blue-500 text-white' : ''}`}
          onClick={() => setCalculatorType('yearly')}
        >
          당해년도 세제혜택 계산기
        </button>
        <button 
          className={`flex-1 py-3 rounded-r-lg font-medium ${calculatorType === 'longterm' ? 'bg-green-500 text-white' : ''}`}
          onClick={() => setCalculatorType('longterm')}
        >
          장기 연금 자산 계산기
        </button>
      </div>
      
      {calculatorType === 'yearly' ? (
        <YearlyTaxBenefitCalculator 
          annualIncome={annualIncome}
          setAnnualIncome={setAnnualIncome}
          age={age}
          setAge={setAge}
          pensionSaving={pensionSaving}
          setPensionSaving={setPensionSaving}
          irpDeposit={irpDeposit}
          setIrpDeposit={setIrpDeposit}
          isaDeposit={isaDeposit}
          setIsaDeposit={setIsaDeposit}
          isaType={isaType}
          setIsaType={setIsaType}
          isaReturnRate={isaReturnRate}
          setIsaReturnRate={setIsaReturnRate}
        />
      ) : (
        <LongTermPensionCalculator 
          annualIncome={annualIncome}
          setAnnualIncome={setAnnualIncome}
          age={age}
          setAge={setAge}
          pensionSaving={pensionSaving}
          setPensionSaving={setPensionSaving}
          irpDeposit={irpDeposit}
          setIrpDeposit={setIrpDeposit}
          isaDeposit={isaDeposit}
          setIsaDeposit={setIsaDeposit}
          isaType={isaType}
          setIsaType={setIsaType}
          generalReturnRate={generalReturnRate}
          setGeneralReturnRate={setGeneralReturnRate}
          isaReturnRate={isaReturnRate}
          setIsaReturnRate={setIsaReturnRate}
          inflationRate={inflationRate}
          setInflationRate={setInflationRate}
          contributionYears={contributionYears}
          setContributionYears={setContributionYears}
          retirementAge={retirementAge}
          setRetirementAge={setRetirementAge}
          withdrawalPeriod={withdrawalPeriod}
          setWithdrawalPeriod={setWithdrawalPeriod}
          withdrawalType={withdrawalType}
          setWithdrawalType={setWithdrawalType}
          reinvestRate={reinvestRate}
          setReinvestRate={setReinvestRate}
        />
      )}
    </div>
  );
};

// 당해년도 세제혜택 계산기
const YearlyTaxBenefitCalculator = ({
  annualIncome, setAnnualIncome,
  age, setAge,
  pensionSaving, setPensionSaving,
  irpDeposit, setIrpDeposit,
  isaDeposit, setIsaDeposit,
  isaType, setIsaType,
  isaReturnRate, setIsaReturnRate
}) => {
  // 세제혜택 결과
  const [taxBenefit, setTaxBenefit] = useState({
    pension: 0,
    isa: 0,
    irp: 0,
    total: 0
  });
  
  const [recommendations, setRecommendations] = useState([]);
  
  // 세제혜택 계산
  const calculateTaxBenefits = () => {
    // 세액공제율 결정 (소득 5,500만원 이하 또는 50세 이상: 16.5%, 그 외: 13.2%)
    const taxDeductionRate = (annualIncome <= 5500 || age >= 50) ? 0.165 : 0.132;
    
    // 연금저축 세액공제 (최대 600만원)
    const pensionLimit = 600;
    const pensionAmount = Math.min(pensionSaving, pensionLimit);
    const pensionBenefit = pensionAmount * taxDeductionRate;
    
    // IRP 세액공제 (연금저축과 합산 최대 900만원)
    const totalLimit = 900;
    const irpLimit = totalLimit - pensionAmount;
    const irpAmount = Math.min(irpDeposit, irpLimit);
    const irpBenefit = irpAmount * taxDeductionRate;
    
    // ISA 이자소득세 절감 (ISA 특화 수익률 사용)
    const isaTaxFreeLimit = isaType === 'normal' ? 200 : 400;
    const annualReturn = isaReturnRate / 100;
    const isaInterest = isaDeposit * annualReturn;
    const isaTaxSaving = Math.min(isaInterest, isaTaxFreeLimit) * 0.154;
    
    // 총 세제혜택
    const totalBenefit = pensionBenefit + irpBenefit + isaTaxSaving;
    
    setTaxBenefit({
      pension: pensionBenefit,
      isa: isaTaxSaving,
      irp: irpBenefit,
      total: totalBenefit
    });
    
    // 세제혜택 최적화 추천 생성
    generateRecommendations(pensionAmount, irpAmount, pensionLimit, irpLimit, taxDeductionRate);
  };
  
  // 추천사항 생성
  const generateRecommendations = (pensionAmount, irpAmount, pensionLimit, irpLimit, taxDeductionRate) => {
    const recommendations = [];
    
    // 연금저축 한도 미달 시 추천
    if (pensionAmount < pensionLimit) {
      recommendations.push(`연금저축을 ${pensionAmount}만원에서 ${pensionLimit}만원으로 증액하면 세제혜택이 약 ${Math.round((pensionLimit - pensionAmount) * taxDeductionRate)}만원 추가됩니다.`);
    }
    
    // IRP 한도 미달 시 추천
    if (irpAmount < irpLimit) {
      recommendations.push(`IRP 납입액을 증액하여 추가 ${Math.round((irpLimit - irpAmount) * taxDeductionRate)}만원의 세제혜택을 받을 수 있습니다.`);
    }
    
    // ISA 관련 추천
    recommendations.push(`ISA 만기 자금을 연금계좌로 이체하면 이체금액의 10%(최대 300만원)까지 추가 세액공제를 받을 수 있습니다.`);
    
    setRecommendations(recommendations);
  };
  
  // 입력값 변경 시 세제혜택 재계산
  useEffect(() => {
    calculateTaxBenefits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annualIncome, pensionSaving, isaDeposit, irpDeposit, age, isaType, isaReturnRate]);
  
  // 숫자 포맷팅 함수
  const formatNumber = (num) => {
    return Math.round(num).toLocaleString();
  };
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 입력 영역 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">기본 정보</h2>
          
          <div className="mb-3">
            <label className="block text-sm mb-1">연 소득 (만원)</label>
            <input
              type="number"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
            <p className="text-xs text-gray-500 mt-1">세액공제율: {annualIncome <= 5500 || age >= 50 ? '16.5%' : '13.2%'}</p>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm mb-1">현재 연령</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
            <p className="text-xs text-gray-500 mt-1">만 50세 이상은 세액공제율 16.5% 적용</p>
          </div>
                  
          <h2 className="text-xl font-semibold my-4">납입 정보</h2>
          
          <div className="mb-4">
            <label className="block text-sm mb-1">연금저축 연간 납입액 (만원)</label>
            <input
              type="number"
              value={pensionSaving}
              onChange={(e) => setPensionSaving(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
            <p className="text-xs text-gray-500 mt-1">최대 세액공제 한도: 600만원</p>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm mb-1">IRP 연간 납입액 (만원)</label>
            <input
              type="number"
              value={irpDeposit}
              onChange={(e) => setIrpDeposit(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
            <p className="text-xs text-gray-500 mt-1">연금저축과 합산하여 최대 900만원까지 세액공제 가능</p>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm mb-1">ISA 연간 납입액 (만원)</label>
            <input
              type="number"
              value={isaDeposit}
              onChange={(e) => setIsaDeposit(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
            <p className="text-xs text-gray-500 mt-1">연 납입한도: 2,000만원</p>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm mb-1">ISA 수익률 (%)</label>
            <input
              type="number"
              value={isaReturnRate}
              onChange={(e) => setIsaReturnRate(Number(e.target.value))}
              className="w-full p-2 border rounded"
              step="0.1"
            />
            <p className="text-xs text-gray-500 mt-1">ISA 계좌 내 자산의 예상 수익률</p>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm mb-1">ISA 계좌 유형</label>
            <select
              value={isaType}
              onChange={(e) => setIsaType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="normal">일반형 (비과세 한도: 200만원)</option>
              <option value="special">서민형/농어민형 (비과세 한도: 400만원)</option>
            </select>
          </div>
        </div>
        
        {/* 결과 영역 */}
        <div>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">당해년도 세제혜택</h2>
            
            <div className="text-center mb-4">
              <p className="text-sm">총 세제혜택</p>
              <p className="text-3xl font-bold text-blue-700">{formatNumber(taxBenefit.total)}만원</p>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm">연금저축 세액공제</span>
                <span>{formatNumber(taxBenefit.pension)}만원</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">IRP 세액공제</span>
                <span>{formatNumber(taxBenefit.irp)}만원</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">ISA 이자소득세 절감</span>
                <span>{formatNumber(taxBenefit.isa)}만원</span>
              </div>
              <div className="flex justify-between items-center text-xs mt-2 pt-2 border-t">
                <span>이자소득세 절감 계산 근거</span>
                <span>ISA 예상 수익: {formatNumber(isaDeposit * isaReturnRate / 100)}만원 × 세율 15.4%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">세제혜택 최적화 추천</h2>
            <ul className="list-disc pl-5 space-y-2">
              {recommendations.map((rec, index) => (
                <li key={index} className="text-sm">{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">알아두세요</h2>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>연금저축은 연간 납입액 600만원까지 세액공제를 받을 수 있습니다.</li>
          <li>IRP는 연금저축과 합산하여 연간 납입액 900만원까지 세액공제를 받을 수 있습니다.</li>
          <li>총급여 5,500만원 이하 또는 만 50세 이상인 경우 세액공제율은 16.5%, 그 외에는 13.2%입니다.</li>
          <li>ISA 계좌는 일반형은 200만원까지, 서민형과 농어민형은 400만원까지 비과세 혜택이 적용됩니다.</li>
          <li>본 계산기는 참고용이며, 정확한 세제혜택은 세무사와 상담하시기 바랍니다.</li>
        </ul>
      </div>
    </div>
  );
};

// 장기 연금 자산 계산기
const LongTermPensionCalculator = ({
  annualIncome, setAnnualIncome,
  age, setAge,
  pensionSaving, setPensionSaving,
  irpDeposit, setIrpDeposit,
  isaDeposit, setIsaDeposit,
  isaType, setIsaType,
  generalReturnRate, setGeneralReturnRate,
  isaReturnRate, setIsaReturnRate,
  inflationRate, setInflationRate,
  contributionYears, setContributionYears,
  retirementAge, setRetirementAge,
  withdrawalPeriod, setWithdrawalPeriod,
  withdrawalType, setWithdrawalType,
  reinvestRate, setReinvestRate
}) => {
  // 계산 결과
  const [results, setResults] = useState({
    totalContribution: {
      pension: 0,
      irp: 0,
      isa: 0,
      total: 0
    },
    totalTaxBenefit: {
      pension: 0,
      irp: 0,
      isa: 0,
      total: 0
    },
    futureValue: {
      pension: 0,
      irp: 0,
      isa: 0,
      taxBenefit: 0,
      total: 0,
      totalReal: 0 // 실질 구매력 추가
    },
    afterTaxWithdrawal: {
      pension: 0,
      irp: 0,
      isa: 0,
      taxBenefit: 0,
      total: 0,
      totalReal: 0 // 실질 구매력 추가
    },
    monthlyIncome: 0,
    monthlyIncomeReal: 0 // 실질 구매력 기준 월 소득 추가
  });
  
  // 장기 자산 가치 계산
  const calculateLongTermResults = () => {
    // 세액공제율 결정
    const taxDeductionRate = (annualIncome <= 5500 || age >= 50) ? 0.165 : 0.132;
    
    // 1. 총 납입액 및 세제혜택 계산
    // 연금저축 세액공제 (최대 600만원)
    const pensionLimit = 600;
    const pensionAmount = Math.min(pensionSaving, pensionLimit);
    const yearlyPensionBenefit = pensionAmount * taxDeductionRate;
    
    // IRP 세액공제 (연금저축과 합산 최대 900만원)
    const totalLimit = 900;
    const irpLimit = totalLimit - pensionAmount;
    const irpAmount = Math.min(irpDeposit, irpLimit);
    const yearlyIrpBenefit = irpAmount * taxDeductionRate;
    
    // ISA 이자소득세 절감
    const isaTaxFreeLimit = isaType === 'normal' ? 200 : 400;
    const annualIsaReturn = isaReturnRate / 100;
    const isaInterest = isaDeposit * annualIsaReturn;
    const yearlyIsaBenefit = Math.min(isaInterest, isaTaxFreeLimit) * 0.154;
    
    // 총 연간 세제혜택
    const yearlyTotalBenefit = yearlyPensionBenefit + yearlyIrpBenefit + yearlyIsaBenefit;
    
    // 총 납입기간 동안의 납입액과 세제혜택
    const totalPensionContribution = pensionSaving * contributionYears;
    const totalIrpContribution = irpDeposit * contributionYears;
    const totalIsaContribution = isaDeposit * contributionYears;
    const totalContribution = totalPensionContribution + totalIrpContribution + totalIsaContribution;
    
    const totalPensionBenefit = yearlyPensionBenefit * contributionYears;
    const totalIrpBenefit = yearlyIrpBenefit * contributionYears;
    const totalIsaBenefit = yearlyIsaBenefit * contributionYears;
    const totalTaxBenefit = totalPensionBenefit + totalIrpBenefit + totalIsaBenefit;
    
    // 2. 은퇴 시점의 자산 가치 계산
    const yearsToRetirement = retirementAge - age;
    
    // 수익률 변환
    const generalReturnFactor = generalReturnRate / 100;
    const isaReturnFactor = isaReturnRate / 100;
    const reinvestReturnFactor = reinvestRate / 100;
    const inflationFactor = inflationRate / 100;
    
    // // 실질 수익률 계산 (명목 수익률 - 인플레이션)
    // const realGeneralReturnFactor = (1 + generalReturnFactor) / (1 + inflationFactor) - 1;
    // const realIsaReturnFactor = (1 + isaReturnFactor) / (1 + inflationFactor) - 1;
    // const realReinvestReturnFactor = (1 + reinvestReturnFactor) / (1 + inflationFactor) - 1;
    
    // 연금저축 적립액 미래가치
    const pensionFV = calculateFutureValueWithRegularDeposit(
      0, pensionSaving, generalReturnFactor, Math.min(yearsToRetirement, contributionYears)
    );
    
    // IRP 적립액 미래가치
    const irpFV = calculateFutureValueWithRegularDeposit(
      0, irpDeposit, generalReturnFactor, Math.min(yearsToRetirement, contributionYears)
    );
    
    // ISA 적립액 미래가치
    const isaFV = calculateFutureValueWithRegularDeposit(
      0, isaDeposit, isaReturnFactor, Math.min(yearsToRetirement, contributionYears)
    );
    
    // 세제혜택 재투자 미래가치
    const taxBenefitFV = calculateFutureValueWithRegularDeposit(
      0, yearlyTotalBenefit, reinvestReturnFactor, Math.min(yearsToRetirement, contributionYears)
    );
    
    // 은퇴 시점 총 자산
    const totalFV = pensionFV + irpFV + isaFV + taxBenefitFV;
    
    // 인플레이션 고려한 실질 가치 계산
    const inflationDiscountFactor = Math.pow(1 + inflationFactor, yearsToRetirement);
    const totalRealFV = totalFV / inflationDiscountFactor;
    
    // 3. 인출 시 세후 수령액 계산
    let afterTaxPension, afterTaxIrp, afterTaxIsa, afterTaxTaxBenefit, totalAfterTax, monthlyIncome;
    
    if (withdrawalType === 'lumpsum') {
      // 일시금 수령 시 세금
      afterTaxPension = pensionFV * 0.835; // 연금저축 일시금 수령 시 기타소득세 16.5%
      afterTaxIrp = irpFV * 0.80; // IRP 일시금 수령 시 퇴직소득세 약 20% 가정
      afterTaxIsa = isaFV; // ISA는 비과세
      afterTaxTaxBenefit = taxBenefitFV * 0.846; // 일반 금융소득세 15.4% 가정
      
      totalAfterTax = afterTaxPension + afterTaxIrp + afterTaxIsa + afterTaxTaxBenefit;
      monthlyIncome = 0; // 일시금은 월 소득 없음
    } else {
      // 연금 수령 시 세금 (연금소득세 간소화, 연 1,200만원 이하 3.3%, 그 이상 5.5% 가정)
      const annualWithdrawalPension = pensionFV / withdrawalPeriod;
      const annualWithdrawalIrp = irpFV / withdrawalPeriod;
      const annualWithdrawalIsa = isaFV / withdrawalPeriod;
      const annualWithdrawalTaxBenefit = taxBenefitFV / withdrawalPeriod;
      
      const totalAnnualWithdrawal = annualWithdrawalPension + annualWithdrawalIrp + 
                                   annualWithdrawalIsa + annualWithdrawalTaxBenefit;
      
      const pensionTaxRate = totalAnnualWithdrawal <= 1200 ? 0.033 : 0.055;
      
      afterTaxPension = pensionFV * (1 - pensionTaxRate);
      afterTaxIrp = irpFV * (1 - pensionTaxRate);
      afterTaxIsa = isaFV; // ISA는 비과세
      afterTaxTaxBenefit = taxBenefitFV * (1 - 0.154); // 일반 금융소득세 15.4%
      
      totalAfterTax = afterTaxPension + afterTaxIrp + afterTaxIsa + afterTaxTaxBenefit;
      monthlyIncome = totalAfterTax / withdrawalPeriod / 12;
    }
    
    // 실질 구매력 기준 세후 수령액
    const totalRealAfterTax = totalAfterTax / inflationDiscountFactor;
    const monthlyIncomeReal = withdrawalType === 'annuity' ? totalRealAfterTax / withdrawalPeriod / 12 : 0;
    
    // 결과 설정
    setResults({
      totalContribution: {
        pension: totalPensionContribution,
        irp: totalIrpContribution,
        isa: totalIsaContribution,
        total: totalContribution
      },
      totalTaxBenefit: {
        pension: totalPensionBenefit,
        irp: totalIrpBenefit,
        isa: totalIsaBenefit,
        total: totalTaxBenefit
      },
      futureValue: {
        pension: pensionFV,
        irp: irpFV,
        isa: isaFV,
        taxBenefit: taxBenefitFV,
        total: totalFV,
        totalReal: totalRealFV
      },
      afterTaxWithdrawal: {
        pension: afterTaxPension,
        irp: afterTaxIrp,
        isa: afterTaxIsa,
        taxBenefit: afterTaxTaxBenefit,
        total: totalAfterTax,
        totalReal: totalRealAfterTax
      },
      monthlyIncome: monthlyIncome,
      monthlyIncomeReal: monthlyIncomeReal
    });
  };
  
  // 정기 납입 시 미래가치 계산 함수
  const calculateFutureValueWithRegularDeposit = (initialAmount, yearlyDeposit, rate, years) => {
    if (rate === 0) return initialAmount + (yearlyDeposit * years);
    
    const futureValueOfInitial = initialAmount * Math.pow(1 + rate, years);
    const futureValueOfDeposits = yearlyDeposit * ((Math.pow(1 + rate, years) - 1) / rate);
    
    return futureValueOfInitial + futureValueOfDeposits;
  };
  
  // 입력값 변경 시 계산 다시 수행
  useEffect(() => {
    calculateLongTermResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    annualIncome, age, pensionSaving, irpDeposit, isaDeposit, isaType,
    generalReturnRate, isaReturnRate, inflationRate, contributionYears, retirementAge,
    withdrawalPeriod, withdrawalType, reinvestRate
  ]);
  
  // 숫자 포맷팅 함수
  const formatNumber = (num) => {
    return Math.round(num).toLocaleString();
  };
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 좌측 입력 패널 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">기본 정보</h2>
          
          <div className="mb-3">
            <label className="block text-sm mb-1">연 소득 (만원)</label>
            <input
              type="number"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
            <p className="text-xs text-gray-500 mt-1">세액공제율: {annualIncome <= 5500 || age >= 50 ? '16.5%' : '13.2%'}</p>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm mb-1">현재 연령</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-sm mb-1">납입 기간 (년)</label>
              <input
                type="number"
                value={contributionYears}
                onChange={(e) => setContributionYears(Number(e.target.value))}
                className="w-full p-2 border rounded"
                min="1"
                max="50"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">은퇴 예상 연령</label>
              <input
                type="number"
                value={retirementAge}
                onChange={(e) => setRetirementAge(Number(e.target.value))}
                className="w-full p-2 border rounded"
                min={age}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-sm mb-1">연금 수령 방식</label>
              <select
                value={withdrawalType}
                onChange={(e) => setWithdrawalType(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="annuity">연금 수령</option>
                <option value="lumpsum">일시금 수령</option>
              </select>
            </div>
            {withdrawalType === 'annuity' && (
              <div>
                <label className="block text-sm mb-1">연금 수령 기간 (년)</label>
                <input
                  type="number"
                  value={withdrawalPeriod}
                  onChange={(e) => setWithdrawalPeriod(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                  min="10"
                  max="40"
                />
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-sm mb-1">연금저축/IRP 수익률 (%)</label>
              <input
                type="number"
                value={generalReturnRate}
                onChange={(e) => setGeneralReturnRate(Number(e.target.value))}
                className="w-full p-2 border rounded"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">ISA 수익률 (%)</label>
              <input
                type="number"
                value={isaReturnRate}
                onChange={(e) => setIsaReturnRate(Number(e.target.value))}
                className="w-full p-2 border rounded"
                step="0.1"
              />
            </div>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm mb-1">인플레이션 비율 (%)</label>
            <input
              type="number"
              value={inflationRate}
              onChange={(e) => setInflationRate(Number(e.target.value))}
              className="w-full p-2 border rounded"
              step="0.1"
              min="0"
              max="10"
            />
            <p className="text-xs text-gray-500 mt-1">향후 평균 물가상승률</p>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm mb-1">세제혜택 재투자 수익률 (%)</label>
            <input
              type="number"
              value={reinvestRate}
              onChange={(e) => setReinvestRate(Number(e.target.value))}
              className="w-full p-2 border rounded"
              step="0.1"
            />
            <p className="text-xs text-gray-500 mt-1">세제혜택으로 돌아온 금액의 재투자 수익률</p>
          </div>
          
          <h2 className="text-xl font-semibold my-4">연간 납입액</h2>
          
          <div className="mb-3">
            <label className="block text-sm mb-1">연금저축 (만원)</label>
            <input
              type="number"
              value={pensionSaving}
              onChange={(e) => setPensionSaving(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm mb-1">IRP (만원)</label>
            <input
              type="number"
              value={irpDeposit}
              onChange={(e) => setIrpDeposit(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm mb-1">ISA (만원)</label>
            <input
              type="number"
              value={isaDeposit}
              onChange={(e) => setIsaDeposit(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm mb-1">ISA 계좌 유형</label>
            <select
              value={isaType}
              onChange={(e) => setIsaType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="normal">일반형 (비과세 한도: 200만원)</option>
              <option value="special">서민형/농어민형 (비과세 한도: 400만원)</option>
            </select>
          </div>
        </div>
        
        {/* 우측 결과 패널 */}
        <div>
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-3">은퇴 자산 요약</h2>
            
            <div className="flex flex-col items-center mb-4 p-3 bg-white rounded-lg">
              <p className="text-sm">은퇴 시점 총 자산 ({retirementAge}세)</p>
              <p className="text-3xl font-bold text-green-700">{formatNumber(results.futureValue.total)}만원</p>
              <p className="text-sm text-gray-500">(실질 구매력: {formatNumber(results.futureValue.totalReal)}만원)</p>
              
              {withdrawalType === 'annuity' && (
                <div className="mt-2 text-center">
                  <p className="text-sm">월 예상 연금 (세후)</p>
                  <p className="text-2xl font-bold text-green-600">{formatNumber(results.monthlyIncome)}만원</p>
                  <p className="text-sm text-gray-500">(실질 구매력: {formatNumber(results.monthlyIncomeReal)}만원)</p>
                  <p className="text-xs text-gray-500">({withdrawalPeriod}년간 수령 기준)</p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-white rounded-lg">
                <p className="text-sm text-center mb-1">총 납입금액</p>
                <p className="text-xl font-bold text-center text-blue-600">{formatNumber(results.totalContribution.total)}만원</p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <p className="text-sm text-center mb-1">총 세제혜택</p>
                <p className="text-xl font-bold text-center text-purple-600">{formatNumber(results.totalTaxBenefit.total)}만원</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">은퇴 시점 자산 구성</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">연금저축</span>
                  <span>{formatNumber(results.futureValue.pension)}만원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">IRP</span>
                  <span>{formatNumber(results.futureValue.irp)}만원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">ISA</span>
                  <span>{formatNumber(results.futureValue.isa)}만원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">세제혜택 재투자</span>
                  <span>{formatNumber(results.futureValue.taxBenefit)}만원</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">세후 실수령액 분석</h2>
            
            <div className="flex flex-col items-center mb-4 p-3 bg-white rounded-lg">
              <p className="text-sm">총 세후 수령액</p>
              <p className="text-2xl font-bold text-indigo-700">{formatNumber(results.afterTaxWithdrawal.total)}만원</p>
              <p className="text-sm text-gray-500">(실질 구매력: {formatNumber(results.afterTaxWithdrawal.totalReal)}만원)</p>
              <p className="text-xs text-gray-500 mt-1">
                (세전 대비 {Math.round(results.afterTaxWithdrawal.total / results.futureValue.total * 100)}% 수령)
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">연금저축 (세후)</span>
                <span>{formatNumber(results.afterTaxWithdrawal.pension)}만원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">IRP (세후)</span>
                <span>{formatNumber(results.afterTaxWithdrawal.irp)}만원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">ISA (비과세)</span>
                <span>{formatNumber(results.afterTaxWithdrawal.isa)}만원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">세제혜택 재투자 (세후)</span>
                <span>{formatNumber(results.afterTaxWithdrawal.taxBenefit)}만원</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-medium mb-2">세금 절감 효과</h3>
              <p className="text-sm">
                {withdrawalType === 'annuity' 
                  ? `연금 수령 방식으로 인한 세금 절감 효과: 약 ${formatNumber(results.futureValue.total * 0.1)}만원`
                  : `일시금 수령 시 세금 부담: 약 ${formatNumber(results.futureValue.total - results.afterTaxWithdrawal.total)}만원`
                }
              </p>
              <p className="text-sm mt-2">
                총 세제혜택 {formatNumber(results.totalTaxBenefit.total)}만원이 {retirementAge-age}년 후 
                {formatNumber(results.futureValue.taxBenefit)}만원으로 성장 
                (수익률 {reinvestRate}% 가정)
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">연금 관련 세금 정보</h2>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>연금 수령 시 세금: 연간 1,200만원 이하 3.3%, 초과 5.5% (지방소득세 포함, 간소화)</li>
          <li>일시금 수령 시 세금: 연금저축 16.5%, IRP 퇴직소득세율 (약 15~35%, 평균 20% 가정)</li>
          <li>ISA는 수령 방식과 관계없이 비과세됩니다.</li>
          <li>세제혜택 재투자금은 일반 금융상품으로 가정하여 이자소득세 15.4%가 적용됩니다.</li>
          <li>인플레이션은 미래 자산의 실질 구매력에 영향을 미칩니다. 명목 금액과 실질 구매력을 함께 확인하세요.</li>
          <li>본 계산기는 참고용이며, 정확한 납입 및 수령 계획은 전문가와 상담하시기 바랍니다.</li>
        </ul>
      </div>
    </div>
  );
};

export default CombinedPensionCalculator;