[//]: # (title: 서버 측 Kotlin)

Kotlin은 서버 사이드 애플리케이션 개발에 매우 적합합니다. 기존 Java 기반 기술 스택과의 완벽한 호환성을 유지하면서도 간결하고 표현력 있는 코드를 작성할 수 있으며, 이 모든 것이 완만한 학습 곡선과 함께 제공됩니다.

*   **표현력**: Kotlin의 혁신적인 언어 기능(예: [타입-안전 빌더 (type-safe builders)](type-safe-builders.md) 및 [위임 속성 (delegated properties)](delegated-properties.md) 지원)은 강력하고 사용하기 쉬운 추상화를 구축하는 데 도움이 됩니다.
*   **확장성**: Kotlin의 [코루틴 (coroutines)](coroutines-overview.md) 지원은 적당한 하드웨어 요구 사항으로도 대규모 클라이언트에 맞춰 확장되는 서버 사이드 애플리케이션을 구축하는 데 도움이 됩니다.
*   **상호 운용성**: Kotlin은 모든 Java 기반 프레임워크와 완벽하게 호환되므로, 익숙한 기술 스택을 사용하면서도 더 현대적인 언어의 이점을 누릴 수 있습니다.
*   **마이그레이션**: Kotlin은 대규모 코드베이스를 Java에서 Kotlin으로 점진적으로 마이그레이션하는 것을 지원합니다. 시스템의 이전 부분은 Java로 유지하면서 새로운 코드를 Kotlin으로 작성하기 시작할 수 있습니다.
*   **도구**: 일반적인 뛰어난 IDE 지원 외에도, Kotlin은 IntelliJ IDEA Ultimate용 플러그인에서 프레임워크별 도구(예: Spring 및 Ktor용)를 제공합니다.
*   **학습 곡선**: Java 개발자에게 Kotlin을 시작하는 것은 매우 쉽습니다. Kotlin 플러그인에 포함된 자동 Java-Kotlin 변환기는 첫 단계에 도움이 됩니다. [Kotlin Koans](koans.md)는 일련의 인터랙티브 연습을 통해 주요 언어 기능을 안내합니다. [Ktor](https://ktor.io/)와 같은 Kotlin 전용 프레임워크는 더 큰 프레임워크의 숨겨진 복잡성 없이 간단하고 직관적인 접근 방식을 제공합니다.

## Kotlin을 사용한 서버 사이드 개발 프레임워크

다음은 Kotlin용 서버 사이드 프레임워크의 몇 가지 예시입니다.

*   [Spring](https://spring.io)은 Kotlin의 언어 기능을 활용하여 버전 5.0부터 [더 간결한 API](https://spring.io/blog/2017/01/04/introducing-kotlin-support-in-spring-framework-5-0)를 제공합니다. [온라인 프로젝트 생성기](https://start.spring.io/#!language=kotlin)를 사용하면 Kotlin으로 새 프로젝트를 빠르게 생성할 수 있습니다.

*   [Ktor](https://github.com/kotlin/ktor)는 JetBrains가 Kotlin으로 웹 애플리케이션을 만들기 위해 구축한 프레임워크로, 높은 확장성을 위해 코루틴을 활용하며 사용하기 쉽고 관용적인 API를 제공합니다.

*   [Quarkus](https://quarkus.io/guides/kotlin)는 Kotlin 사용을 위한 최고 수준 지원을 제공합니다. 이 프레임워크는 오픈 소스이며 Red Hat에서 유지보수합니다. Quarkus는 Kubernetes를 위해 처음부터 구축되었으며, 성장하는 수백 개의 최고 수준 라이브러리 목록을 활용하여 응집력 있는 풀스택 프레임워크를 제공합니다.

*   JVM에서 반응형 웹 애플리케이션을 구축하기 위한 프레임워크인 [Vert.x](https://vertx.io)는 [전체 문서](https://vertx.io/docs/vertx-core/kotlin/)를 포함하여 Kotlin에 대한 [전용 지원](https://github.com/vert-x3/vertx-lang-kotlin)을 제공합니다.

*   [kotlinx.html](https://github.com/kotlin/kotlinx.html)은 웹 애플리케이션에서 HTML을 구축하는 데 사용할 수 있는 DSL입니다. JSP 및 FreeMarker와 같은 전통적인 템플릿 시스템의 대안으로 사용됩니다.

*   [Micronaut](https://micronaut.io/)는 모듈화되고 테스트하기 쉬운 마이크로서비스 및 서버리스 애플리케이션을 구축하기 위한 최신 JVM 기반 풀스택 프레임워크입니다. 유용한 내장 기능이 많이 포함되어 있습니다.

*   [http4k](https://http4k.org/)는 순수 Kotlin으로 작성된 Kotlin HTTP 애플리케이션을 위한 작은 설치 공간을 가진 함수형 툴킷입니다. 이 라이브러리는 Twitter의 "함수로서의 서버" (Your Server as a Function) 논문을 기반으로 하며, HTTP 서버와 클라이언트를 모두 함께 구성할 수 있는 간단한 Kotlin 함수로 모델링합니다.

*   [Javalin](https://javalin.io)은 웹소켓, HTTP/2 및 비동기 요청을 지원하는 Kotlin 및 Java를 위한 매우 가벼운 웹 프레임워크입니다.

*   영속성 (persistence)을 위한 사용 가능한 옵션에는 직접 JDBC 접근, JPA, 그리고 Java 드라이버를 통한 NoSQL 데이터베이스 사용이 포함됩니다. JPA의 경우, [kotlin-jpa 컴파일러 플러그인](no-arg-plugin.md#jpa-support)은 Kotlin 컴파일 클래스를 프레임워크 요구 사항에 맞게 조정합니다.

> 더 많은 프레임워크는 [https://kotlin.link/](https://kotlin.link/resources)에서 찾을 수 있습니다.
>
{style="note"}

## Kotlin 서버 사이드 애플리케이션 배포

Kotlin 애플리케이션은 Amazon Web Services, Google Cloud Platform 등을 포함하여 Java 웹 애플리케이션을 지원하는 모든 호스트에 배포할 수 있습니다.

[Heroku](https://www.heroku.com)에 Kotlin 애플리케이션을 배포하려면 [공식 Heroku 튜토리얼](https://devcenter.heroku.com/articles/getting-started-with-kotlin)을 따를 수 있습니다.

AWS Labs는 [AWS Lambda](https://aws.amazon.com/lambda/) 함수 작성을 위한 Kotlin 사용법을 보여주는 [샘플 프로젝트](https://github.com/awslabs/serverless-photo-recognition)를 제공합니다.

Google Cloud Platform은 GCP에 Kotlin 애플리케이션을 배포하는 일련의 튜토리얼을 제공합니다. [Ktor 및 App Engine](https://cloud.google.com/community/tutorials/kotlin-ktor-app-engine-java8)과 [Spring 및 App Engine](https://cloud.google.com/community/tutorials/kotlin-springboot-app-engine-java8) 모두에 대한 튜토리얼이 있습니다. 또한, Kotlin Spring 애플리케이션을 배포하기 위한 [인터랙티브 코드랩](https://codelabs.developers.google.com/codelabs/cloud-spring-cloud-gcp-kotlin)도 있습니다.

## 서버 측에서 Kotlin을 사용하는 제품

[Corda](https://www.corda.net/)는 주요 은행의 지원을 받으며 전적으로 Kotlin으로 구축된 오픈 소스 분산원장 플랫폼입니다.

JetBrains의 전체 라이선스 판매 및 유효성 검사 프로세스를 담당하는 시스템인 [JetBrains Account](https://account.jetbrains.com/)는 100% Kotlin으로 작성되었으며, 2015년부터 프로덕션 환경에서 큰 문제 없이 실행되고 있습니다.

[Chess.com](https://www.chess.com/)은 체스와 이 게임을 사랑하는 전 세계 수백만 명의 플레이어들을 위한 웹사이트입니다. Chess.com은 여러 HTTP 클라이언트의 원활한 구성을 위해 Ktor를 사용합니다.

[Adobe](https://blog.developer.adobe.com/streamlining-server-side-app-development-with-kotlin-be8cf9d8b61a) 엔지니어들은 서버 사이드 앱 개발에 Kotlin을, Adobe Experience Platform에서 프로토타이핑에 Ktor를 사용합니다. 이 플랫폼은 조직이 데이터 과학 및 머신러닝을 적용하기 전에 고객 데이터를 중앙 집중화하고 표준화할 수 있도록 합니다.

## 다음 단계

*   언어에 대한 더 심층적인 소개를 위해 이 사이트의 Kotlin 문서와 [Kotlin Koans](koans.md)를 확인하십시오.
*   Kotlin 코루틴을 사용하는 프레임워크인 [Ktor로 비동기 서버 애플리케이션을 구축하는 방법](https://ktor.io/docs/server-create-a-new-project.html)을 살펴보십시오.
*   ["Micronaut for microservices with Kotlin" 웨비나](https://micronaut.io/2020/12/03/webinar-micronaut-for-microservices-with-kotlin/)를 시청하고, Micronaut 프레임워크에서 [Kotlin 확장 함수 (extension functions)](extensions.md#extension-functions)를 사용하는 방법을 보여주는 상세 [가이드](https://guides.micronaut.io/latest/micronaut-kotlin-extension-fns.html)를 살펴보십시오.
*   http4k는 완전한 형태의 프로젝트를 생성하는 [CLI](https://toolbox.http4k.org)와, 단일 bash 명령으로 GitHub, Travis, Heroku를 사용하여 전체 CD 파이프라인을 생성하는 [스타터](https://start.http4k.org) 레포를 제공합니다.
*   Java에서 Kotlin으로 마이그레이션하고 싶으신가요? [Java 및 Kotlin에서 문자열 관련 일반적인 작업](java-to-kotlin-idioms-strings.md)을 수행하는 방법을 알아보십시오.