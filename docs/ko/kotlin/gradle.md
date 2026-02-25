[//]: # (title: Gradle)

Gradle은 빌드 프로세스를 자동화하고 관리하는 것을 도와주는 빌드 시스템입니다. 필요한 의존성을 다운로드하고, 코드를 패키징하며, 컴파일을 위한 준비를 수행합니다. Gradle의 기초 및 세부 사항에 대해서는 [Gradle 웹사이트](https://docs.gradle.org/current/userguide/userguide.html)에서 확인할 수 있습니다.

[이 가이드](gradle-configure-project.md)를 따라 다양한 플랫폼에 맞는 프로젝트를 직접 설정하거나, Kotlin으로 간단한 백엔드 "Hello World" 애플리케이션을 만드는 방법을 보여주는 짧은 [단계별 튜토리얼](get-started-with-jvm-gradle-project.md)을 진행해 볼 수 있습니다.

> Kotlin, Gradle 및 Android Gradle 플러그인 버전 간의 호환성에 대한 정보는 [여기](gradle-configure-project.md#apply-the-plugin)에서 확인할 수 있습니다.
> 
{style="tip"}

이 장에서는 다음 내용에 대해서도 배울 수 있습니다:
* [컴파일러 옵션 및 전달 방법](gradle-compiler-options.md).
* [증분 컴파일(Incremental compilation), 캐시 지원, 빌드 보고서 및 Kotlin 데몬](gradle-compilation-and-caches.md).
* [Gradle 플러그인 변형(variants) 지원](gradle-plugin-variants.md).

## 다음 단계는?

다음에 대해 알아보세요:
* **Gradle Kotlin DSL**. [Gradle Kotlin DSL](https://docs.gradle.org/current/userguide/kotlin_dsl.html)은 빌드 스크립트를 빠르고 효율적으로 작성하는 데 사용할 수 있는 도메인 특화 언어(domain specific language)입니다.
* **어노테이션 처리(Annotation processing)**. Kotlin은 [Kotlin 심볼 처리 API(Kotlin Symbol processing API, KSP)](ksp-reference.md)를 통해 어노테이션 처리를 지원합니다.
* **문서 생성**. Kotlin 프로젝트의 문서를 생성하려면 [Dokka](https://github.com/Kotlin/dokka)를 사용하세요. 설정 방법은 [Dokka README](https://github.com/Kotlin/dokka/blob/master/README.md#using-the-gradle-plugin)를 참조하시기 바랍니다. Dokka는 혼합 언어(mixed-language) 프로젝트를 지원하며 표준 Javadoc을 포함한 다양한 형식으로 결과물을 생성할 수 있습니다.
* **OSGi**. OSGi 지원에 대해서는 [Kotlin OSGi 페이지](kotlin-osgi.md)를 참조하세요.