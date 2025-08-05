[//]: # (title: 리소스 개요)

Compose Multiplatform는 지원되는 모든 플랫폼의 공통 코드에서 리소스에 접근할 수 있도록 특별한 `compose-multiplatform-resources` 라이브러리와 Gradle 플러그인 지원을 제공합니다. 리소스는 애플리케이션에서 사용할 수 있는 이미지, 폰트, 문자열과 같은 정적 콘텐츠입니다.

Compose Multiplatform에서 리소스를 다룰 때 다음 사항을 고려하십시오:

*   거의 모든 리소스는 호출자 스레드에서 동기적으로 읽힙니다. 유일한 예외는 비동기적으로 읽히는 원시 파일과 웹 리소스입니다.
*   긴 비디오와 같은 큰 원시 파일을 스트림으로 읽는 것은 아직 지원되지 않습니다. 예를 들어, [kotlinx-io](https://github.com/Kotlin/kotlinx-io) 라이브러리와 같은 시스템 API에 개별 파일을 전달하려면 [`getUri()`](compose-multiplatform-resources-usage.md#accessing-multiplatform-resources-from-external-libraries) 함수를 사용하십시오.
*   1.6.10부터 Kotlin 2.0.0 이상 및 Gradle 7.6 이상을 사용하는 경우 리소스를 어떤 모듈이나 소스 세트에도 배치할 수 있습니다.

Compose Multiplatform에서 리소스를 다루는 방법을 배우려면 다음 주요 섹션을 참조하십시오:

*   [](compose-multiplatform-resources-setup.md)

    앱이 접근할 수 있어야 하는 `resources` 라이브러리 의존성을 추가하고 모든 리소스를 설정하십시오.

*   [](compose-multiplatform-resources-usage.md)

    자동 생성된 접근자를 사용하여 UI 코드에서 리소스에 직접 접근하는 방법을 배우십시오.

*   [로컬 리소스 환경](compose-resource-environment.md)

    앱 내 테마 및 언어와 같은 앱의 리소스 환경을 관리하십시오.