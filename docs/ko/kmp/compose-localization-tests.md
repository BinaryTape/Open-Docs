# 로컬라이제이션 테스트 (Localization tests)
<show-structure depth="2"/>

로컬라이제이션(Localization)을 테스트하려면, 다양한 로캘(locale)에 대해 올바르게 번역된 문자열이 표시되는지 확인하고, 포맷팅과 레이아웃이 해당 로캘의 요구 사항에 맞게 조정되는지 확인해야 합니다.

## 플랫폼별 로캘 테스트

### Android

Android에서는 **설정(Settings) | 시스템(System) | 언어 및 입력(Languages & input) | 언어(Languages)**를 통해 기기의 시스템 로캘을 변경할 수 있습니다.
자동화된 테스트의 경우, `adb` 셸(shell)을 사용하여 에뮬레이터에서 로캘을 직접 수정할 수 있습니다:

```shell
adb -e shell
setprop persist.sys.locale [BCP-47 language tag];stop;sleep 5;start
```

이 명령은 에뮬레이터를 재시작하여 새로운 로캘로 앱을 다시 실행할 수 있게 합니다.

또는 Espresso와 같은 프레임워크를 사용하여 테스트를 실행하기 전에 프로그래밍 방식으로 로캘을 구성할 수 있습니다. 
예를 들어, `LocaleTestRule()`을 사용하여 테스트 중에 로캘 전환을 자동화할 수 있습니다.

### iOS

iOS에서는 **설정(Settings) | 일반(General) | 언어 및 지역(Language & Region)**을 통해 기기의 시스템 언어와 지역을 변경할 수 있습니다.
XCUITest 프레임워크를 사용하는 자동화된 UI 테스트의 경우, 실행 인수(launch arguments)를 사용하여 로캘 변경을 시뮬레이션합니다:

```swift
app.launchArguments = [
    "-AppleLanguages", "(es)",
    "-AppleLocale", "es_ES"
]
```

### Desktop

데스크톱에서 JVM 로캘은 일반적으로 운영체제의 로캘을 기본값으로 사용합니다. 
설정 위치는 데스크톱 플랫폼마다 다릅니다.

UI가 초기화되기 전에 테스트 설정이나 애플리케이션 진입점에서 프로그래밍 방식으로 JVM 기본 로캘을 설정할 수 있습니다:

```java
java.util.Locale.setDefault(java.util.Locale("es_ES"))
``` 

### Web

빠른 확인을 위해 브라우저 설정에서 언어 설정을 변경할 수 있습니다.
자동화된 테스트의 경우, Selenium이나 Puppeteer와 같은 브라우저 자동화 도구를 사용하여 로캘 변경을 시뮬레이션할 수 있습니다. 

또는 `window.navigator.languages` 속성의 읽기 전용 제한을 우회하여 커스텀 로캘을 도입해 볼 수도 있습니다. 자세한 내용은 [](compose-resource-environment.md) 튜토리얼에서 확인하세요.

## 주요 테스트 시나리오

### 커스텀 로캘 (Custom locale)

* 프로그래밍 방식으로 로캘을 재정의(override)합니다.
* UI 요소, 포맷팅된 문자열, 레이아웃이 선택한 로캘에 맞게 올바르게 조정되는지 확인합니다. 여기에는 해당되는 경우 오른쪽에서 왼쪽으로 쓰는(right-to-left) 텍스트 처리도 포함됩니다.

### 기본 리소스 (Default resources)

지정된 로캘에 대한 번역을 사용할 수 없는 경우 기본 리소스(Default resources)가 사용됩니다. 
애플리케이션은 이러한 기본값으로 올바르게 폴백(fallback)되어야 합니다.

* 위에서 설명한 플랫폼별 방법을 사용하여 로캘을 지원되지 않는 값으로 구성합니다.
* 폴백 메커니즘이 기본 리소스를 올바르게 로드하고 적절하게 표시하는지 확인합니다.

### 로캘별 사례 (Locale-specific cases)

일반적인 로컬라이제이션 문제를 방지하려면 다음과 같은 로캘별 사례를 고려하세요:

* 날짜 형식(`MM/dd/yyyy` 대 `dd/MM/yyyy`) 및 숫자 형식과 같은 [로캘별 포맷팅](compose-regional-format.md)을 테스트합니다.
* [RTL 및 LTR 동작](compose-rtl.md)을 검증하여 아랍어나 히브리어와 같이 오른쪽에서 왼쪽으로 쓰는 언어에서 문자열, 레이아웃, 정렬이 제대로 표시되는지 확인합니다.