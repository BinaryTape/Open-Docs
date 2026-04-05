[//]: # (title: 將您的程式庫發佈至 Maven Central – 教學)

在本教學中，您將學習如何將您的 Kotlin Multiplatform 程式庫發佈到 [Maven Central](https://central.sonatype.com/) 存儲庫。

要發佈您的程式庫，您需要：

1. 設定憑據，包括 Maven Central 帳戶和用於簽名的 PGP 金鑰。
2. 在您的程式庫專案中配置發佈外掛程式。
3. 向發佈外掛程式提供您的憑據，以便它可以對您的產物進行簽名並上傳。
4. 執行發佈任務，可以在本機執行或使用持續整合。

本教學假設您正處於以下情況：

* 正在建立一個開源程式庫。
* 將程式庫的程式碼存儲在 GitHub 存儲庫中。
* 使用 macOS 或 Linux。如果您是 Windows 使用者，請使用 [GnuPG 或 Gpg4win](https://gnupg.org/download) 來產生金鑰對。
* 尚未在 Maven Central 註冊，或擁有適合[發佈到 Central Portal](https://central.sonatype.org/publish-ea/publish-ea-guide/) 的現有帳戶（於 2024 年 3 月 12 日之後建立，或由其支援團隊遷移到 Central Portal）。
* 使用 GitHub Actions 進行持續整合。

> 即使您使用不同的設定，這裡的大多數步驟仍然適用，但您可能需要考慮一些差異。
> 
> 一個[重要的限制](multiplatform-publish-lib-setup.md#host-requirements)是 Apple 目標必須在裝有 macOS 的電腦上建置。
> 
{style="note"}

## 範例程式庫

在本教學中，您將使用 [fibonacci](https://github.com/Kotlin/multiplatform-library-template/) 程式庫作為範例。您可以參考該存儲庫的程式碼來查看發佈設定是如何運作的。

如果您想重複使用該程式碼，您 **必須將所有範例值替換為** 您專案特定的值。

## 準備帳戶與憑據

要開始發佈到 Maven Central，請在 [Maven Central](https://central.sonatype.com/) 入口網站登入（或建立新帳戶）。

### 選擇並驗證命名空間

您需要一個經過驗證的命名空間，以便在 Maven Central 上唯一識別您程式庫的產物。

Maven 產物由其座標（coordinates）來識別，例如 `com.example:fibonacci-library:1.0.0`。這些座標由三個部分組成，並以冒號分隔：

* 反向 DNS 形式的 `groupId`，例如 `com.example`
* `artifactId`：程式庫本身的唯一名稱，例如 `fibonacci-library`
* `version`：版本字串，例如 `1.0.0`。版本可以是任何字串，但不能以 `-SNAPSHOT` 結尾

您註冊的命名空間允許您在 Maven Central 上設定 `groupId` 的格式。例如，如果您註冊了 `com.example` 命名空間，您就可以發佈 `groupId` 設定為 `com.example`、`com.example.libraryname`、`com.example.module.feature` 等的產物。

登入 Maven Central 後，導航至 [Namespaces](https://central.sonatype.com/publishing/namespaces) 頁面。然後，點擊 **Add Namespace** 按鈕並註冊您的命名空間：

<Tabs>
<TabItem id="github" title="使用 GitHub 存儲庫">

如果您沒有擁有的網域名稱，使用您的 GitHub 帳戶建立命名空間是一個不錯的選擇：

1. 輸入 `io.github.<your username>` 作為您的命名空間，例如 `io.github.kotlinhandson` 並點擊 **Submit**。
2. 複製新建立的命名空間下顯示的 **Verification Key**。
3. 在 GitHub 上，使用您使用的使用者名稱登入，並建立一個新的公共存儲庫，以該驗證金鑰作為存儲庫名稱，例如 `http://github.com/kotlin-hands-on/ex4mpl3c0d`。
4. 返回 Maven Central 並點擊 **Verify Namespace** 按鈕。驗證成功後，您可以刪除所建立的存儲庫。

</TabItem>
<TabItem id="domain" title="使用網域名稱">

要將您擁有的網域名稱用作命名空間：

1. 使用反向 DNS 形式輸入您的網域作為命名空間。如果您的網域是 `example.com`，請輸入 `com.example`。
2. 複製顯示的 **Verification Key**。
3. 建立一個新的 TXT DNS 記錄，並以該驗證金鑰作為其內容。

   有關如何在各個網域註冊商處執行此操作的更多資訊，請參閱 [Maven Central 的常見問題](https://central.sonatype.org/faq/how-to-set-txt-record/)。
4. 返回 Maven Central 並點擊 **Verify Namespace** 按鈕。驗證成功後，您可以刪除所建立的 TXT 記錄。

</TabItem>
</Tabs>

#### 產生金鑰對

在向 Maven Central 發佈內容之前，您需要使用 [PGP 簽名](https://central.sonatype.org/publish/requirements/gpg/)對您的產物進行簽名，這允許使用者驗證產物的來源。

要開始簽名，您需要產生一個金鑰對：

* **私鑰** 用於對您的產物進行簽名，且不應與他人共享。
* **公鑰** 可以與他人共享，以便他們驗證您產物的簽名。

<Tabs group ="key-pair-tools">
<TabItem title="使用 Kotlin Gradle 外掛程式" group-key="kgp">

Kotlin Gradle 外掛程式有一個 Gradle 任務，可用於產生金鑰對。

1. 使用以下指令產生金鑰對。請提供私鑰金鑰庫的密碼和您的姓名，格式如下：

    ```bash
    ./gradlew -Psigning.password=example-password generatePgpKeys --name "John Smith <john@example.com>"
    ```

   金鑰對存儲在 `build/pgp` 目錄中。

2. 將您的金鑰對從 `build/pgp` 目錄移動到安全位置，以防止意外刪除或未經授權的存取。

</TabItem>
<TabItem title="使用 gpg 工具" group-key="gpg">

可以為您管理簽名的 `gpg` 工具可在 [GnuPG 網站](https://gnupg.org/download/index.html)上取得。您也可以使用套件管理員（如 [Homebrew](https://brew.sh/)）安裝它：

```bash 
brew install gpg
```

1. 使用以下指令開始產生金鑰對，並在提示時提供所需的詳細資訊：

    ```bash
    gpg --full-generate-key
    ```

2. 為要建立的金鑰類型選擇建議的預設值。您可以將選項保留為空，然後按 <shortcut>Enter 鍵</shortcut> 以接受預設值。

    ```text
    Please select what kind of key you want:
        (1) RSA and RSA
        (2) DSA and Elgamal
        (3) DSA (sign only)
        (4) RSA (sign only)
        (9) ECC (sign and encrypt) *default*
        (10) ECC (sign only)
        (14) Existing key from card
    Your selection? 9
    
    Please select which elliptic curve you want:
        (1) Curve 25519 *default*
        (4) NIST P-384
        (6) Brainpool P-256
    Your selection? 1
    ```

   > 在撰寫本文時，預設為帶有 `Curve 25519` 的 `ECC (sign and encrypt)`。較舊版本的 `gpg` 可能預設為 `3072` 位元金鑰大小的 `RSA`。
   >
   {style="note"}

3. 當提示指定金鑰的有效期限時，您可以選擇無到期日的預設選項。

   如果您選擇建立在設定的時間後自動過期的金鑰，則在金鑰過期時您需要[延長其有效期](https://central.sonatype.org/publish/requirements/gpg/#dealing-with-expired-keys)。

    ```text
    Please specify how long the key should be valid.
        0 = key does not expire
        <n>  = key expires in n days
        <n>w = key expires in n weeks
        <n>m = key expires in n months
        <n>y = key expires in n years
    Key is valid for? (0) 0
    Key does not expire at all
    
    Is this correct? (y/N) y
    ```

4. 輸入您的姓名、電子郵件和可選的註解，以便將金鑰與身分關聯（您可以將註解欄位保留為空）：

    ```text
    GnuPG needs to construct a user ID to identify your key.

    Real name: Jane Doe
    Email address: janedoe@example.com
    Comment:
    You selected this USER-ID:
        "Jane Doe <janedoe@example.com>"
    ```

5. 輸入密碼短語以加密金鑰，並在提示時重複輸入。

   請安全且私密地存儲此密碼短語。稍後在簽名產物時，您需要它來存取私鑰。

6. 使用以下指令查看您建立的金鑰：

   ```bash
   gpg --list-keys
   ```

   輸出看起來像這樣：

    ```text
    pub   ed25519 2024-10-06 [SC]
          F175482952A225BFD4A07A713EE6B5F76620B385CE
    uid   [ultimate] Jane Doe <janedoe@example.com>
          sub   cv25519 2024-10-06 [E]
    ```

    在接下來的步驟中，您需要使用輸出中顯示的金鑰長英數識別碼。

</TabItem>
</Tabs>

#### 上傳公鑰

您需要[將公鑰上傳到 keyserver](https://central.sonatype.org/publish/requirements/gpg/#distributing-your-public-key)，以便 Maven Central 接受它。有多個可用的金鑰伺服器，我們使用 `keyserver.ubuntu.com` 作為預設選擇。

<Tabs group ="key-pair-tools">
<TabItem title="使用 Kotlin Gradle 外掛程式" group-key="kgp">

Kotlin Gradle 外掛程式有一個 Gradle 任務，可用於上傳公鑰。

執行以下指令上傳您的公鑰，並提供其路徑：

```bash
./gradlew uploadPublicPgpKey --keyring /path_to/build/pgp/public_KEY_ID.asc
```

</TabItem>
<TabItem title="使用 gpg 工具" group-key="gpg">

您需要[將公鑰上傳到 keyserver](https://central.sonatype.org/publish/requirements/gpg/#distributing-your-public-key)，以便 Maven Central 接受它。有多個可用的金鑰伺服器，我們使用 `keyserver.ubuntu.com` 作為預設選擇。

執行以下指令並在參數中**替換為您自己的金鑰 ID**，以使用 `gpg` 上傳您的公鑰：

```bash
gpg --keyserver keyserver.ubuntu.com --send-keys F175482952A225BFC4A07A715EE6B5F76620B385CE
```

**匯出您的私鑰** {id="export-your-private-key"}

要讓您的 Gradle 專案存取您的私鑰，您需要將其匯出到檔案中。系統會提示您輸入建立金鑰時使用的密碼短語。

使用以下指令，並**傳入您自己的金鑰 ID** 作為參數：

```bash
gpg --armor --export-secret-keys F175482952A225BFC4A07A715EE6B5F76620B385CE > key.gpg
```

此指令將建立一個包含您私鑰的 `key.gpg` 文字檔案。

> 絕不要與任何人共享您的私鑰檔案 – 只有您應該擁有存取權，因為私鑰可以使用您的憑據對檔案進行簽名。
>
{style="warning"}

</TabItem>
</Tabs>

## 配置專案

### 準備您的程式庫專案

如果您是從範本專案開始開發程式庫，現在是將專案中的任何預設名稱更改為與您自己的程式庫名稱相符的好時機。這包括您的程式庫模組名稱以及頂層 `build.gradle.kts` 檔案中的根專案名稱。

如果您的專案中有 Android 目標，您應該遵循[準備 Android 程式庫發佈的步驟](https://developer.android.com/build/publish-library/prep-lib-release)。此過程至少要求您為程式庫[指定適當的命名空間](https://developer.android.com/build/publish-library/prep-lib-release#choose-namespace)，以便在編譯資源時產生唯一的 `R` 類別。請注意，該命名空間與[之前建立](#choose-and-verify-a-namespace)的 Maven 命名空間不同。

```kotlin
// build.gradle.kts

android {
    namespace = "io.github.kotlinhandson.fibonacci"
}
```

### 設定發佈外掛程式

本教學使用 [vanniktech/gradle-maven-publish-plugin](https://github.com/vanniktech/gradle-maven-publish-plugin) 來協助發佈到 Maven Central。您可以在[此處](https://vanniktech.github.io/gradle-maven-publish-plugin/#advantages-over-maven-publish)閱讀更多關於該外掛程式優點的資訊。請參閱[外掛程式文件](https://vanniktech.github.io/gradle-maven-publish-plugin/central/)以了解更多關於其用法和可用配置選項的資訊。

要將外掛程式新增至您的專案，請在程式庫模組的 `build.gradle.kts` 檔案的 `plugins {}` 區塊中新增以下行：

```kotlin
// <module directory>/build.gradle.kts

plugins {
    id("com.vanniktech.maven.publish") version "%vanniktechPublishPlugin%" 
}
```

> 有關該外掛程式的最新可用版本，請查看其 [Releases 頁面](https://github.com/vanniktech/gradle-maven-publish-plugin/releases)。
> 
{style="note"}

在同一個檔案中新增以下配置，並確保為您的程式庫自訂所有值：

```kotlin
// <module directory>/build.gradle.kts

mavenPublishing {
    publishToMavenCentral()
    
    signAllPublications()
    
    coordinates(group.toString(), "fibonacci", version.toString())
    
    pom { 
        name = "Fibonacci library"
        description = "A mathematics calculation library."
        inceptionYear = "2024"
        url = "https://github.com/kotlin-hands-on/fibonacci/"
        licenses {
            license {
                name = "The Apache License, Version 2.0"
                url = "https://www.apache.org/licenses/LICENSE-2.0.txt"
                distribution = "https://www.apache.org/licenses/LICENSE-2.0.txt"
            }
        }
        developers {
            developer {
                id = "kotlin-hands-on"
                name = "Kotlin Developer Advocate"
                url = "https://github.com/kotlin-hands-on/"
            }
        }
        scm {
            url = "https://github.com/kotlin-hands-on/fibonacci/"
            connection = "scm:git:git://github.com/kotlin-hands-on/fibonacci.git"
            developerConnection = "scm:git:ssh://git@github.com/kotlin-hands-on/fibonacci.git"
        }
    }
}
```

> 要配置此內容，您也可以使用 [Gradle 屬性](https://docs.gradle.org/current/userguide/build_environment.html)。
> 
{style="tip"}

這裡最重要的設定是：

* `coordinates`：指定您程式庫的 `groupId`、`artifactId` 和 `version`。
* [授權條款](https://central.sonatype.org/publish/requirements/#license-information)：您的程式庫發佈所依據的授權。
* [開發者資訊](https://central.sonatype.org/publish/requirements/#developer-information)：列出程式庫的作者。
* [SCM (原始碼管理) 資訊](https://central.sonatype.org/publish/requirements/#scm-information)：指定程式庫原始碼的代管位置。

### 執行本機檢查

在發佈到 Maven Central 之前，最好先在本機檢查您的專案配置是否正確。

#### 在本機檢查簽名

藉由執行以下指令來驗證您的金鑰是否已正確配置用於簽名：

```bash
./gradlew checkSigningConfiguration
```

此 Gradle 任務會檢查您的公鑰是否已上傳到 `keyserver.ubuntu.com` 或 `keys.openpgp.org` 金鑰伺服器。

如果任務報告錯誤，請查看輸出以獲取有關如何修復它的詳細資訊。

#### 在本機檢查 `pom.xml` 檔案

要將您的程式庫發佈到 Maven Central，`pom.xml` 檔案必須符合 Maven Central 的[要求](https://central.sonatype.org/publish/requirements/#required-pom-metadata)。

對於您計劃發佈的每個程式庫，執行以下指令，並將 `<PUBLICATION_NAME>` 替換為發佈名稱：

```bash
./gradlew checkPomFileFor<PUBLICATION_NAME>Publication
```

使用 [vanniktech/gradle-maven-publish-plugin](https://github.com/vanniktech/gradle-maven-publish-plugin) 時，發佈通常命名為 `Maven`。在這種情況下，任務變為：

```bash
./gradlew checkPomFileForMavenPublication
```

如果任務報告錯誤，請查看輸出以獲取有關如何修復它的詳細資訊。

## 使用持續整合發佈到 Maven Central

### 產生使用者權杖

您需要 Maven 存取權杖，以便 Maven Central 授權您的發佈請求。開啟 [Setup Token-Based Authentication](https://central.sonatype.com/usertoken) 頁面並點擊 **Generate User Token** 按鈕。

輸出如下例所示，包含使用者名稱和密碼。如果您遺失了這些憑據，稍後需要重新產生，因為 Maven Central 不會存儲它們。

```xml
<server>
    <id>${server}</id>
    <username>l2nfaPmz</username>
    <password>gh9jT9XfnGtUngWTZwTu/8141keYdmQpipqLPRKeDLTh</password>
</server>
```

### 將秘密新增至 GitHub

要在 GitHub Action 工作流中使用發佈所需的金鑰和憑據，同時保持它們私密，您需要將這些值存儲為秘密（secrets）。

1. 在您的 GitHub 存儲庫 **Settings** 頁面上，點擊 **Security** | **Secrets and variables** | **Actions**。
2. 點擊 `New repository secret` 按鈕並新增以下秘密：

   * `MAVEN_CENTRAL_USERNAME` 和 `MAVEN_CENTRAL_PASSWORD` 是 Central Portal 網站為[使用者權杖產生的](#generate-the-user-token)值。
   * `SIGNING_KEY_ID` 是您簽名金鑰識別碼的**最後 8 個字元**，例如 `F175482952A225BFC4A07A715EE6B5F76620B385CE` 的 `20B385CE`。
   * `SIGNING_PASSWORD` 是您在產生 GPG 金鑰時提供的密碼短語。
   * `GPG_KEY_CONTENTS` 應包含您 [`key.gpg` 檔案](#export-your-private-key)的完整內容。

   ![將秘密新增至 GitHub](github-secrets.png){width=700}

您將在下一步的 CI 配置中使用這些秘密的名稱。

### 將 GitHub Actions 工作流新增至您的專案

您可以設定持續整合來自動建置和發佈您的程式庫。我們將以 [GitHub Actions](https://docs.github.com/en/actions) 為例。

首先，將以下工作流新增到您存儲庫中的 `.github/workflows/publish.yml` 檔案中：

```yaml
# .github/workflows/publish.yml

name: Publish
on:
  release:
    types: [released, prereleased]
jobs:
  publish:
    name: Release build and publish
    runs-on: macOS-latest
    steps:
      - name: Check out code
        uses: actions/checkout@v4
      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: 21
      - name: Publish to MavenCentral
        run: ./gradlew publishToMavenCentral --no-configuration-cache
        env:
          ORG_GRADLE_PROJECT_mavenCentralUsername: ${{ secrets.MAVEN_CENTRAL_USERNAME }}
          ORG_GRADLE_PROJECT_mavenCentralPassword: ${{ secrets.MAVEN_CENTRAL_PASSWORD }}
          ORG_GRADLE_PROJECT_signingInMemoryKeyId: ${{ secrets.SIGNING_KEY_ID }}
          ORG_GRADLE_PROJECT_signingInMemoryKeyPassword: ${{ secrets.SIGNING_PASSWORD }}
          ORG_GRADLE_PROJECT_signingInMemoryKey: ${{ secrets.GPG_KEY_CONTENTS }}
```

一旦您提交並推送此檔案，只要您在代管專案的 GitHub 存儲庫中建立發佈（包括預發佈），工作流就會自動執行。該工作流會檢出程式碼的目前版本，設定 JDK，然後執行 `publishToMavenCentral` Gradle 任務。

使用 `publishToMavenCentral` 任務時，您仍然需要在 Maven Central 網站上[手動檢查並發佈您的部署](#create-a-release-on-github)。或者，您可以使用 `publishAndReleaseToMavenCentral` 任務來完全自動化發佈過程。

您還可以將工作流配置為在[推送標籤時觸發](https://stackoverflow.com/a/61892639)。

> 由於發佈外掛程式不支援 Gradle [配置快取](https://docs.gradle.org/current/userguide/configuration_cache.html)（請參閱此[開放問題](https://github.com/gradle/gradle/issues/22779)），上述指令碼透過在 Gradle 指令中新增 `--no-configuration-cache` 來停用發佈任務的配置快取。
>
{style="tip"}

此操作需要您的簽名詳細資訊和您的 Maven Central 憑據，這些資訊是您建立為[存儲庫秘密](#add-secrets-to-github)的。工作流配置會自動將這些秘密轉換為環境變數，使其可用於 Gradle 建置過程。

### 在 GitHub 上建立發佈

設定好工作流和秘密後，您現在可以準備[建立發佈](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release)，這將觸發程式庫的發佈。

1. 確保您的程式庫在 `build.gradle.kts` 檔案中指定的版本號是您想要發佈的版本。
2. 轉到您 GitHub 存儲庫的主頁面。
3. 在右側欄中，點擊 **Releases**。
4. 點擊 **Draft a new release** 按鈕（或者如果您之前沒有為此存儲庫建立過發佈，則點擊 **Create a new release** 按鈕）。
5. 每個發佈都有一個標籤。在標籤下拉選單中建立一個新標籤，並設定發佈標題（標籤名稱和標題可以相同）。
   
   您可能希望這些內容與您在 `build.gradle.kts` 檔案中指定的程式庫版本號相同。

   ![在 GitHub 上建立發佈](create-release-and-tag.png){width=700}

6. 仔細檢查您想要發佈的目標分支（特別是如果它不是預設分支），並為您的新版本新增適當的發佈說明。
7. 使用描述下方的核取方塊將發佈標記為預發佈（預發佈對於 Alpha、Beta 或 RC 等早期體驗版本很有用）。
   
   您也可以將該發佈標記為最新版本（如果您之前已經為此存儲庫建立過發佈）。
8. 點擊 **Publish release** 按鈕建立新發佈。
9. 點擊 GitHub 存儲庫頁面頂部的 **Actions** 選項卡。在這裡，您將看到新發佈觸發了您的發佈工作流。
    
   您可以點擊工作流來查看發佈任務的輸出。
10. 工作流執行完成後，導航至 Maven Central 上的 [Deployments](https://central.sonatype.com/publishing/deployments) 儀表板。您應該會在這裡看到一個新的部署。

    在 Maven Central 執行檢查期間，此部署可能會在 _pending_ 或 _validating_ 狀態保持一段時間。

11. 一旦您的部署處於 _validated_ 狀態，請檢查它是否包含您上傳的所有產物。如果一切看起來正確，點擊 **Publish** 按鈕發佈這些產物。

    ![發佈設定](published-on-maven-central.png){width=700}

    > 在發佈後，產物需要一些時間（通常約 15–30 分鐘，但也可能長達數小時）才能在 Maven Central 存儲庫中公開可用。它們被編入索引並在 [Maven Central 網站](https://central.sonatype.com/)上變為可搜尋狀態可能需要更長時間。
    >
    {style="tip"}

要在驗證部署後自動發佈產物，請將工作流中的 `publishToMavenCentral` 任務替換為 `publishAndReleaseToMavenCentral`。

## 下一步

* [進一步了解如何設定多平台程式庫發佈及相關要求](multiplatform-publish-lib-setup.md)
* [在您的 README 中新增 shield.io 徽章](https://shields.io/badges/maven-central-version)
* [使用 Dokka 為您的專案分享 API 文件](https://kotl.in/dokka)
* [新增 Renovate 以自動更新相依性](https://docs.renovatebot.com/)
* [在 JetBrains 的搜尋平台上推廣您的程式庫](https://klibs.io/)
* [在 `#feed` Kotlin Slack 頻道中與社群分享您的程式庫](https://kotlinlang.slack.com/)（要註冊，請造訪 https://kotl.in/slack）