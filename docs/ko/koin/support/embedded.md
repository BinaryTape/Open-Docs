---
title: Koin 임베디드
custom_edit_url: null
---

Koin 임베디드 (Koin Embedded)는 Android/Kotlin SDK 및 라이브러리 개발자를 대상으로 하는 새로운 Koin 프로젝트입니다.

이 프로젝트는 다른 패키지 이름으로 Koin 프로젝트를 재구축하고 패키징하는 데 도움이 되는 스크립트를 제공합니다. 이는 SDK 및 라이브러리 개발을 위한 것으로, 임베디드 Koin 버전과 충돌할 수 있는 Koin의 다른 버전을 사용하는 모든 컨슈밍 애플리케이션 (consuming application) 간의 충돌을 방지하기 위함입니다.

피드백이나 도움이 필요하신가요? [Koin 팀](mailto:koin@kotzilla.io)에 문의하세요.

:::info
이 이니셔티브는 현재 베타 버전이며, 피드백을 기다리고 있습니다.
:::

## 임베디드 버전 (베타)

다음은 Koin 임베디드 버전의 예시입니다: [Kotzilla Repository](https://repository.kotzilla.io/#browse/browse:Koin-Embedded)
- 사용 가능한 패키지: `embedded-koin-core`, `embedded-koin-android`
- 재배치: `org.koin.*`에서 `embedded.koin.*`으로

이 Maven 리포지토리로 Gradle 설정을 구성하세요:
```kotlin
maven { 'https://repository.kotzilla.io/repository/kotzilla-platform/' }
```

## 재배치 스크립트 (베타)

다음은 주어진 패키지 이름으로 Koin을 재구축하고, 이를 임베딩하며 Koin 프레임워크의 일반적인 사용과의 충돌을 방지하는 데 도움이 되는 몇 가지 스크립트입니다.

자세한 내용은 Koin [재배치 스크립트](https://github.com/InsertKoinIO/koin-embedded?tab=readme-ov-file#koin-relocation-scripts) 프로젝트를 참조하세요.