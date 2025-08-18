# 문자열 지역화

지역화는 앱을 다양한 언어, 지역, 문화적 관습에 맞게 조정하는 과정입니다. 이 가이드는 번역 디렉터리를 설정하고, [지역별 형식으로 작업](compose-regional-format.md)하고, [오른쪽에서 왼쪽 (RTL)으로 쓰는 언어를 처리](compose-rtl.md)하며, [플랫폼 전반에서 지역화를 테스트](compose-localization-tests.md)하는 방법을 설명합니다.

Compose Multiplatform에서 문자열을 지역화하려면, 지원되는 모든 언어로 애플리케이션 사용자 인터페이스 요소에 대한 번역된 텍스트를 제공해야 합니다. Compose Multiplatform은 공통 리소스 관리 라이브러리와 코드 생성을 제공하여 이러한 번역에 쉽게 접근할 수 있도록 이 과정을 간소화합니다.

## 번역 디렉터리 설정

모든 문자열 리소스는 공통 소스 세트 내의 전용 `composeResources` 디렉터리에 저장합니다. 기본 텍스트는 `values` 디렉터리에 배치하고, 각 언어에 해당하는 디렉터리를 생성합니다.
다음 구조를 사용하세요.

```
commonMain/composeResources/
├── values/
│   └── strings.xml
├── values-es/
│   └── strings.xml
├── values-fr/
│   └── strings.xml
└── ... (other locale directories)
```

`values` 디렉터리와 그 지역화된 변형 내에서 `strings.xml` 파일을 사용하여 키-값 쌍으로 문자열 리소스를 정의합니다.
예를 들어, 영어 텍스트를 `commonMain/composeResources/values/strings.xml`에 추가합니다.

```xml
<resources>
    <string name="app_name">My Application</string>
    <string name="greeting">Hello, world!</string>
    <string name="welcome_message">Welcome, %s!</string>
</resources>
```

그런 다음, 번역을 위한 해당 지역화된 파일을 생성합니다. 예를 들어, 스페인어 번역을 `commonMain/composeResources/values-es/strings.xml`에 추가합니다.

```xml
<resources>
    <string name="app_name">Mi Aplicación</string>
    <string name="greeting">¡Hola mundo!</string>
    <string name="welcome_message">¡Bienvenido, %s!</string>
</resources>
```

## 정적 접근을 위한 클래스 생성

모든 번역을 추가했으면, 프로젝트를 빌드하여 리소스에 접근할 수 있는 특수 클래스를 생성합니다.
Compose Multiplatform은 `composeResources` 내의 `strings.xml` 리소스 파일을 처리하고 각 문자열 리소스에 대한 정적 접근자 속성을 생성합니다.

결과적으로 생성된 `Res.strings` 객체를 사용하면 공유 코드에서 지역화된 문자열에 안전하게 접근할 수 있습니다.
앱 UI에 문자열을 표시하려면 `stringResource()` 컴포저블 함수를 사용하세요. 이 함수는 사용자의 현재 로케일을 기반으로 올바른 텍스트를 가져옵니다.

```kotlin
import project.composeapp.generated.resources.Res

@Composable
fun MyApp() {
    Text(stringResource(Res.strings.app_name))
    Text(stringResource(Res.strings.greeting))
    Text(stringResource(Res.strings.welcome_message, "User"))
}
```

위 예시에서 `welcome_message` 문자열은 동적 값을 위한 자리표시자(`%s`)를 포함합니다. 생성된 접근자와 `stringResource()` 함수 모두 이러한 매개변수 전달을 지원합니다.

## 다음 단계

*   [지역별 형식 관리 방법 배우기](compose-regional-format.md)
*   [오른쪽에서 왼쪽 (RTL)으로 쓰는 언어 처리 읽어보기](compose-rtl.md)