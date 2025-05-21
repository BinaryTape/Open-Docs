---
title: Gradle
---
Gradle은 빌드 프로세스를 자동화하고 관리하는 데 도움이 되는 빌드 시스템입니다. 필요한 종속성을 다운로드하고, 코드를 패키징하고, 컴파일을 위해 준비합니다. Gradle 기본 사항 및 세부 사항은 [Gradle 웹사이트](https://docs.gradle.org/current/userguide/userguide.html)에서 자세히 알아보세요.

다양한 플랫폼에 대해 [이 지침](gradle-configure-project)을 통해 자체 프로젝트를 설정하거나, Kotlin에서 간단한 백엔드 "Hello World" 애플리케이션을 만드는 방법을 보여주는 간단한 [단계별 튜토리얼](get-started-with-jvm-gradle-project)을 따라 할 수 있습니다.

:::tip
Kotlin, Gradle 및 Android Gradle plugin 버전의 호환성에 대한 정보는 [여기](gradle-configure-project#apply-the-plugin)에서 확인할 수 있습니다.

:::

이 장에서는 다음 내용에 대해서도 알아볼 수 있습니다.
* [컴파일러 옵션 및 전달 방법](gradle-compiler-options).
* [점진적 컴파일, 캐시 지원, 빌드 보고서 및 Kotlin 데몬](gradle-compilation-and-caches).
* [Gradle plugin variants 지원](gradle-plugin-variants).

## 다음 단계

다음 내용에 대해 알아보세요.
* **Gradle Kotlin DSL**. [Gradle Kotlin DSL](https://docs.gradle.org/current/userguide/kotlin_dsl.html)은 빌드 스크립트를 빠르고 효율적으로 작성하는 데 사용할 수 있는 도메인 특정 언어입니다.
* **애노테이션 처리**. Kotlin은 [Kotlin Symbol processing API](ksp-reference)를 통해 애노테이션 처리를 지원합니다.
* **문서 생성**. Kotlin 프로젝트에 대한 문서를 생성하려면 [Dokka](https://github.com/Kotlin/dokka)를 사용하세요. 구성 지침은 [Dokka README](https://github.com/Kotlin/dokka/blob/master/README#using-the-gradle-plugin)를 참조하세요. Dokka는 혼합 언어 프로젝트를 지원하며 표준 Javadoc을 포함한 여러 형식으로 출력을 생성할 수 있습니다.
* **OSGi**. OSGi 지원은 [Kotlin OSGi 페이지](kotlin-osgi)를 참조하세요.