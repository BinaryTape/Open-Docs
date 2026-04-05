[//]: # (title: 백엔드 개발을 위한 Kotlin)

<web-summary>Spring, Ktor 및 기타 백엔드 프레임워크와 함께 Kotlin을 사용하여 서버 애플리케이션을 구축하세요.</web-summary>

Kotlin은 서버 측 애플리케이션 개발에 매우 적합합니다. Kotlin을 사용하면 기존 Java 기반 기술 스택과의 완전한 호환성을 유지하면서도 간결하고 표현력이 풍부한 코드를 작성할 수 있습니다.

## 시작하기

Kotlin은 대규모 코드베이스를 Java에서 Kotlin으로 점진적으로 마이그레이션하는 것을 지원합니다. 프로젝트의 다른 부분은 Java로 유지하면서 테스트나 새로운 프로덕션 코드를 Kotlin으로 작성하기 시작할 수 있습니다.

Java 프로젝트에서 Kotlin을 사용할 수 있도록 설정하고, IntelliJ IDEA에 포함된 자동 Java-to-Kotlin 변환기를 활용해 보세요.

<a href="mixing-java-kotlin-intellij.md"><img src="backend-get-started-button.svg" alt="Introduce Kotlin to your Java project" style="block"/></a>

## 프레임워크 살펴보기

Kotlin은 모든 Java 기반 프레임워크와 완벽하게 호환되므로, 익숙한 기술 스택을 그대로 사용하면서 Kotlin 문법의 장점을 누릴 수 있습니다. 일반적인 뛰어난 IDE 지원 외에도, Kotlin은 IntelliJ IDEA Ultimate의 Spring 및 Ktor 지원과 같은 프레임워크 전용 도구를 제공합니다.

### Spring

[Spring](https://spring.io)은 Kotlin의 언어 기능을 활용하여 더 간결한 API를 제공합니다. [온라인 프로젝트 생성기](https://start.spring.io/#!language=kotlin)를 사용하면 Kotlin으로 새 프로젝트를 빠르게 생성할 수 있습니다.

<a href="jvm-get-started-spring-boot.md"><img src="spring-get-started-button.svg" alt="Get started with Spring Boot and Kotlin" style="block"/></a>

### Ktor

[Ktor](https://github.com/kotlin/ktor)는 JetBrains에서 구축한 Kotlin 웹 애플리케이션 개발용 프레임워크입니다. 높은 확장성을 위해 코루틴을 활용하며 사용하기 쉽고 관용적인(idiomatic) API를 제공합니다.

<a href="https://ktor.io/docs/server-create-a-new-project.html"><img src="ktor-get-started-button.svg" alt="Create a new Ktor project" style="block"/></a>

### 기타 프레임워크

다음은 Kotlin용 백엔드 프레임워크의 몇 가지 다른 예시입니다.

| 프레임워크 | 설명 |
|--------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Quarkus](https://quarkus.io/guides/kotlin)            | Kotlin을 위한 퍼스트 클래스 지원을 제공하는 오픈 소스 프레임워크입니다. Quarkus는 처음부터 Kubernetes를 위해 구축되었으며, 수백 개의 엄선된 최고 수준 라이브러리 목록을 활용하여 응집력 있는 풀스택 프레임워크를 제공합니다. |
| [Vert.x](https://vertx.io)                             | JVM에서 리액티브 웹 애플리케이션을 구축하기 위한 프레임워크입니다. Vert.x는 [Kotlin 코루틴 통합](https://vertx.io/docs/vertx-lang-kotlin-coroutines/kotlin/)을 포함하여 Kotlin을 위한 [전용 지원](https://github.com/vert-x3/vertx-lang-kotlin)을 제공합니다. |
| [kotlinx.html](https://github.com/kotlin/kotlinx.html) | 웹 애플리케이션에서 HTML을 구축하는 데 사용할 수 있는 DSL입니다. 이는 JSP나 FreeMarker와 같은 전통적인 템플릿 시스템의 대안으로 사용됩니다. |
| [Micronaut](https://micronaut.io/)                     | 모듈식이며 테스트가 용이한 마이크로서비스 및 서버리스 애플리케이션을 구축하기 위한 현대적인 JVM 기반 풀스택 프레임워크입니다. 웨비나 ["Micronaut for microservices with Kotlin"](https://micronaut.io/2020/12/03/webinar-micronaut-for-microservices-with-kotlin/)을 시청하고, Micronaut 프레임워크에서 [Kotlin 확장 함수(extension functions)](extensions.md#extension-functions)를 사용하는 방법을 보여주는 상세 [가이드](https://guides.micronaut.io/latest/micronaut-kotlin-extension-fns.html)를 살펴보세요. |
| [http4k](https://http4k.org/)                          | 순수 Kotlin으로 작성된 Kotlin HTTP 애플리케이션을 위한 아주 작은 점유 공간(footprint)의 함수형 툴킷입니다. http4k는 완전한 형태의 프로젝트 템플릿을 생성하기 위한 [CLI 지원 툴박스](https://toolbox.http4k.org)와 선택한 백엔드, 모듈, 빌드 도구로 작동하는 http4k 애플리케이션을 부트스트랩하기 위한 웹 기반 [프로젝트 마법사](https://toolbox.http4k.org/project)를 제공합니다. |
| [Javalin](https://javalin.io)                          | Kotlin 및 Java를 위한 매우 가벼운 웹 프레임워크로 WebSocket, HTTP2 및 비동기 요청을 지원합니다. |

## 애플리케이션 배포

Kotlin 애플리케이션은 Amazon Web Services (AWS), Google Cloud Platform (GCP) 등을 포함하여 Java 웹 애플리케이션을 지원하는 모든 호스트에 배포할 수 있습니다.

* **AWS**는 서비스와 상호 작용하기 위한 전용 [Kotlin용 SDK](https://docs.aws.amazon.com/sdk-for-kotlin/latest/developer-guide/home.html)를 제공합니다. 서버리스 배포의 경우, [Kotlin용 AWS Lambda 코드 예제](https://docs.aws.amazon.com/sdk-for-kotlin/latest/developer-guide/kotlin_lambda_code_examples.html)를 참조할 수 있습니다.
* **Ktor**를 사용하면 Kotlin 애플리케이션을 다양한 클라우드 제공업체에 게시할 수 있습니다. 예를 들어, Ktor 튜토리얼을 따라 [Google App Engine](https://ktor.io/docs/google-app-engine.html) 및 기타 서비스로의 배포에 대해 자세히 알아볼 수 있습니다.
* **Spring** 애플리케이션 역시 대부분의 대중적인 클라우드 제공업체와 호환됩니다. [공식 Spring 문서](https://spring.io/projects/spring-boot)에서 Spring Boot 애플리케이션을 클라우드에 배포하는 방법을 확인하세요.

## 다음 단계

* [Kotlin과 JUnit을 사용하여 Java Maven 프로젝트를 테스트하는 방법 알아보기](jvm-test-using-junit.md)
* [Ktor로 비동기 서버 애플리케이션을 구축하는 방법 살펴보기](https://ktor.io/docs/server-create-a-new-project.html)