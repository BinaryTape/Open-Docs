[//]: # (title: 그레이들)

그레이들은 빌드 프로세스를 자동화하고 관리하는 데 도움이 되는 빌드 시스템입니다. 그레이들은 필요한 의존성(dependency)을 다운로드하고, 코드를 패키징하며, 컴파일을 위해 준비합니다. 그레이들의 기본 사항 및 세부 정보는 [그레이들 웹사이트](https://docs.gradle.org/current/userguide/userguide.html)에서 확인할 수 있습니다.

[이 지침](gradle-configure-project.md)에 따라 다양한 플랫폼에서 자신만의 프로젝트를 설정하거나, 간단한 백엔드 "Hello World" 코틀린 애플리케이션을 생성하는 방법을 보여주는 짧은 [단계별 튜토리얼](get-started-with-jvm-gradle-project.md)을 따라 할 수 있습니다.

> 코틀린, 그레이들, Android Gradle 플러그인 버전의 호환성에 대한 정보는 [여기](gradle-configure-project.md#apply-the-plugin)에서 확인할 수 있습니다.
>
{style="tip"}

이 챕터에서는 다음 내용에 대해서도 알아볼 수 있습니다:
* [컴파일러 옵션 및 전달 방법](gradle-compiler-options.md).
* [증분 컴파일, 캐시 지원, 빌드 보고서, 코틀린 데몬](gradle-compilation-and-caches.md).
* [그레이들 플러그인 변형 지원](gradle-plugin-variants.md).

## 다음은 무엇인가요?

다음에 대해 알아보세요:
* **그레이들 코틀린 DSL**. [그레이들 코틀린 DSL](https://docs.gradle.org/current/userguide/kotlin_dsl.html)은 빌드 스크립트를 빠르고 효율적으로 작성하는 데 사용할 수 있는 도메인 특화 언어(DSL)입니다.
* **어노테이션 처리**. 코틀린은 [코틀린 심볼 처리 API](ksp-reference.md)를 통해 어노테이션 처리를 지원합니다.
* **문서 생성**. 코틀린 프로젝트의 문서를 생성하려면 [Dokka](https://github.com/Kotlin/dokka)를 사용하세요. 설정 지침은 [Dokka README](https://github.com/Kotlin/dokka/blob/master/README.md#using-the-gradle-plugin)를 참조하세요. Dokka는 혼합 언어 프로젝트를 지원하며 표준 Javadoc을 포함한 여러 형식으로 출력을 생성할 수 있습니다.
* **OSGi**. OSGi 지원에 대해서는 [코틀린 OSGi 페이지](kotlin-osgi.md)를 참조하세요.