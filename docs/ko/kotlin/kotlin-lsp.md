[//]: # (title: Kotlin Language Server)
<primary-label ref="alpha"/>

<web-summary>Kotlin Language Server는 JetBrains의 공식 Kotlin용 LSP 구현체로, VS Code 지원, 코드 완성, 진단, 포매팅 및 리팩터링 기능을 제공합니다.</web-summary>

[Kotlin Language Server](https://github.com/Kotlin/kotlin-lsp)는 JetBrains가 공식적으로 구현한 Kotlin용 [Language Server Protocol (LSP)](https://microsoft.github.io/language-server-protocol/)입니다.

이 서버는 IntelliJ IDEA, IntelliJ IDEA Kotlin 플러그인, JetBrains AIR 및 Fleet을 기반으로 합니다. LSP를 지원하는 모든 코드 에디터에서 작동하도록 설계되었습니다.

> [IntelliJ IDEA](https://www.jetbrains.com/idea/)와 [Android Studio](https://developer.android.com/studio)는 최상의 Kotlin 개발 환경을 제공합니다.
>
{style="note"}

## Visual Studio Code에서의 Kotlin

Kotlin Language Server는 [Visual Studio Code](https://code.visualstudio.com/)를 위한 공식 Kotlin 언어 지원을 제공합니다.

Visual Studio Code를 사용하여 Kotlin을 개발하려면 Visual Studio Marketplace에서 공식 [Kotlin by JetBrains](https://marketplace.visualstudio.com/items?itemName=JetBrains.kotlin-server) 확장을 설치하세요.

**Kotlin by JetBrains** 확장을 활성화하려면, Visual Studio Code에서 Kotlin 프로젝트를 열고 아무 Kotlin 파일이나 실행하세요.

## 지원 기능

Kotlin Language Server는 다음과 같은 핵심 언어 기능을 포함합니다:

* 최신 Kotlin 언어 버전 지원
* IntelliJ 기반 코드 완성
* Kotlin 및 `kotlinx.*` 라이브러리에 대한 IntelliJ 기반 진단 및 퀵 픽스(Quick Fix)
* JVM 프로젝트용 빌드 시스템 지원: Gradle, Maven 및 실험적인 Android Gradle 플러그인 지원

  > Kotlin 멀티플랫폼(Kotlin Multiplatform) 프로젝트 지원은 현재 개발 중입니다.
  >
  {style="tip"}

* 시맨틱 하이라이팅(Semantic highlighting)
* 가져오기(Import) 정리
* 이름 변경 리팩터링
* 코드 포매팅
* 문서 탐색 및 호버(Hover) 지원
* 호출 계층 구조(Call hierarchy)
* 코드 폴딩(Code folding)

## 피드백

Kotlin Language Server는 활발히 개발 중이며, 특히 알파(Alpha) 단계에서는 여러분의 피드백이 매우 소중합니다.

문제를 발견하거나 개선 사항을 제안하고 싶다면 [Kotlin LSP 저장소](https://github.com/Kotlin/kotlin-lsp)에 보고해 주세요.

## 다음 단계

* [GitHub의 Kotlin Language Server 저장소](https://github.com/Kotlin/kotlin-lsp) 살펴보기