# 문자열 로컬라이징

로컬라이징(Localization)은 앱을 다양한 언어, 지역 및 문화적 관습에 맞게 조정하는 과정입니다. 
이 가이드에서는 번역 디렉터리를 설정하고, [지역별 형식 사용](compose-regional-format.md), [오른쪽에서 왼쪽으로 읽는(RTL) 언어 처리](compose-rtl.md), 그리고 플랫폼 전반에 걸친 [로컬라이징 테스트](compose-localization-tests.md) 방법을 설명합니다.

Compose Multiplatform에서 문자열을 로컬라이징하려면 지원하는 모든 언어에 대해 애플리케이션 사용자 인터페이스 요소의 번역된 텍스트를 제공해야 합니다. Compose Multiplatform은 공통 리소스 관리 라이브러리와 번역에 쉽게 접근할 수 있는 코드 생성 기능을 제공하여 이 과정을 간소화합니다.

## 번역 디렉터리 설정하기

모든 문자열 리소스는 공통 소스 세트(common source set) 내의 전용 `composeResources` 디렉터리에 저장합니다. 
기본 텍스트는 `values` 디렉터리에 배치하고, 각 언어에 해당하는 디렉터리를 생성하세요.
다음과 같은 구조를 사용합니다:

```
commonMain/composeResources/
├── values/
│   └── strings.xml
├── values-es/
│   └── strings.xml
├── values-fr/
│   └── strings.xml
└── ... (기타 로케일 디렉터리)
```

`values` 디렉터리와 로컬라이징된 변체 디렉터리 내의 `strings.xml` 파일에 키-값 쌍(key-value pairs)을 사용하여 문자열 리소스를 정의합니다.
예를 들어, `commonMain/composeResources/values/strings.xml`에 영어 텍스트를 추가합니다:

```xml
<resources>
    <string name="app_name">My Application</string>
    <string name="greeting">Hello, world!</string>
    <string name="welcome_message">Welcome, %s!</string>
</resources>
```

그런 다음, 번역을 위한 해당 로컬라이징 파일을 생성합니다. 예를 들어, `commonMain/composeResources/values-es/strings.xml`에 스페인어 번역을 추가합니다:

```xml
<resources>
    <string name="app_name">Mi Aplicación</string>
    <string name="greeting">¡Hola mundo!</string>
    <string name="welcome_message">¡Bienvenido, %s!</string>
</resources>
```

## 정적 액세스를 위한 클래스 생성

모든 번역을 추가한 후, 리소스에 접근할 수 있는 특수 클래스를 생성하기 위해 프로젝트를 빌드합니다.
Compose Multiplatform은 `composeResources`에 있는 `strings.xml` 리소스 파일을 처리하고 각 문자열 리소스에 대한 정적 액세서(accessor) 속성을 생성합니다.

생성된 `Res.strings` 객체를 사용하면 공유 코드에서 로컬라이징된 문자열에 안전하게 접근할 수 있습니다.
앱의 UI에 문자열을 표시하려면 `stringResource()` 컴포저블 함수를 사용하세요. 
이 함수는 사용자의 현재 로케일(locale)을 기반으로 올바른 텍스트를 가져옵니다:

```kotlin
import project.shared.generated.resources.Res

@Composable
fun MyApp() {
    Text(stringResource(Res.strings.app_name))
    Text(stringResource(Res.strings.greeting))
    Text(stringResource(Res.strings.welcome_message, "User"))
}
```

위의 예시에서 `welcome_message` 문자열은 동적 값을 위한 플레이스홀더(`%s`)를 포함하고 있습니다. 
생성된 액세서와 `stringResource()` 함수 모두 이러한 매개변수 전달을 지원합니다.

## 다음 단계

* [지역별 형식을 관리하는 방법 알아보기](compose-regional-format.md)
* [오른쪽에서 왼쪽으로 읽는(Right-to-left) 언어 처리에 대해 읽어보기](compose-rtl.md)