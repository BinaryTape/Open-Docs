[//]: # (title: 將您的函式庫發佈到 Maven Central – 教學)

在本教學中，您將學習如何將您的 Kotlin Multiplatform 函式庫發佈到 [Maven Central](https://central.sonatype.com/) 儲存庫。

要發佈您的函式庫，您需要：

1.  設定憑證，包括 Maven Central 上的帳戶和用於簽署的 PGP 金鑰。
2.  在函式庫專案中配置發佈外掛程式。
3.  向發佈外掛程式提供您的憑證，以便它可以簽署並上傳您的構件。
4.  執行發佈任務，無論是在本機還是使用持續整合。

本教學假設您：

*   正在建立一個開源函式庫。
*   將函式庫的程式碼儲存在 GitHub 儲存庫中。
*   使用 macOS 或 Linux。如果您是 Windows 使用者，請使用 [GnuPG 或 Gpg4win](https://gnupg.org/download) 來產生金鑰對。
*   尚未在 Maven Central 註冊，或已擁有適合[發佈到 Central Portal](https://central.sonatype.org/publish-ea/publish-ea-guide/) 的現有帳戶（在 2024 年 3 月 12 日之後建立，或由其支援遷移到 Central Portal）。
*   使用 GitHub Actions 進行持續整合。

> 這裡的大多數步驟在您使用不同設定時仍然適用，但可能存在一些您需要考量的差異。
>
> 一個[重要的限制](multiplatform-publish-lib-setup.md#host-requirements) 是 Apple 目標必須在 macOS 機器上建構。
>
{style="note"}

## 範例函式庫

在本教學中，您將使用 [fibonacci](https://github.com/Kotlin/multiplatform-library-template/) 函式庫作為範例。
您可以參考該儲存庫的程式碼，了解發佈設定的運作方式。

如果您想重複使用這些程式碼，您**必須將所有範例值**替換為您專案特有的值。

## 準備帳戶和憑證

要開始發佈到 Maven Central，請在 [Maven Central](https://central.sonatype.com/) 入口網站登入（或建立新帳戶）。

### 選擇並驗證命名空間

您需要一個經過驗證的命名空間，以便在 Maven Central 上唯一識別您的函式庫構件。

Maven 構件由其[座標](https://central.sonatype.org/publish/requirements/#correct-coordinates)識別，例如 `com.example:fibonacci-library:1.0.0`。這些座標由三部分組成，以冒號分隔：

*   `groupId` 以反向 DNS 格式表示，例如 `com.example`
*   `artifactId`：函式庫本身的唯一名稱，例如 `fibonacci-library`
*   `version`：版本字串，例如 `1.0.0`。版本可以是任何字串，但不能以 `-SNAPSHOT` 結尾

您註冊的命名空間允許您在 Maven Central 上設定 `groupId` 的格式。例如，如果您註冊 `com.example` 命名空間，您可以發佈 `groupId` 設定為 `com.example`、`com.example.libraryname`、`com.example.module.feature` 等的構件。

登入 Maven Central 後，導覽至 [Namespaces](https://central.sonatype.com/publishing/namespaces) 頁面。
然後，點擊 **Add Namespace** 按鈕並註冊您的命名空間：

<Tabs>
<TabItem id="github" title="使用 GitHub 儲存庫">

如果您沒有網域名稱，使用您的 GitHub 帳戶建立命名空間是一個不錯的選擇：

1.  輸入 `io.github.<您的使用者名稱>` 作為您的命名空間，例如 `io.github.kotlinhandson`，然後點擊 **Submit**。
2.  複製新建立命名空間下顯示的 **Verification Key**。
3.  在 GitHub 上，使用您使用的使用者名稱登入，並建立一個新的公共儲存庫，以驗證金鑰作為儲存庫的名稱，例如 `http://github.com/kotlin-hands-on/ex4mpl3c0d`。
4.  導覽回 Maven Central，然後點擊 **Verify Namespace** 按鈕。驗證成功後，您可以刪除您建立的儲存庫。

</TabItem>
<TabItem id="domain" title="使用網域名稱">

要使用您擁有的網域名稱作為您的命名空間：

1.  以反向 DNS 格式輸入您的網域作為命名空間。如果您的網域是 `example.com`，請輸入 `com.example`。
2.  複製顯示的 **Verification Key**。
3.  建立一個新的 TXT DNS 記錄，並以驗證金鑰作為其內容。

    有關如何使用各種網域註冊商執行此操作的更多資訊，請參閱 [Maven Central 的 FAQ](https://central.sonatype.org/faq/how-to-set-txt-record/)。
4.  返回 Maven Central，然後點擊 **Verify Namespace** 按鈕。驗證成功後，您可以刪除您建立的 TXT 記錄。

</TabItem>
</Tabs>

#### 產生金鑰對

在您將內容發佈到 Maven Central 之前，您需要使用 [PGP 簽章](https://central.sonatype.org/publish/requirements/gpg/)來簽署您的構件，這允許使用者驗證構件的來源。

要開始簽署，您需要產生一個金鑰對：

*   _私密金鑰_ 用於簽署您的構件，不應與他人分享。
*   _公開金鑰_ 可以與他人分享，以便他們可以驗證您的構件的簽名。

<Tabs group ="key-pair-tools">
<TabItem title="使用 Kotlin Gradle 外掛程式" group-key="kgp">

Kotlin Gradle 外掛程式有一個 Gradle 任務，您可以用來產生金鑰對。

1.  使用以下命令產生金鑰對。提供私密金鑰儲存的密碼和您的姓名，格式如下：

    ```bash
    ./gradlew -Psigning.password=example-password generatePgpKeys --name "John Smith <john@example.com>"
    ```

    金鑰對儲存在 `build/pgp` 目錄中。

2.  將您的金鑰對從 `build/pgp` 目錄移至安全位置，以防止意外刪除或未經授權的存取。

</TabItem>
<TabItem title="使用 gpg 工具" group-key="gpg">

可為您管理簽名的 `gpg` 工具可在 [GnuPG 網站](https://gnupg.org/download/index.html)上找到。
您也可以使用套件管理器（例如 [Homebrew](https://brew.sh/)）進行安裝：

```bash 
brew install gpg
```

1.  使用以下命令開始產生金鑰對，並在提示時提供所需的詳細資訊：

    ```bash
    gpg --full-generate-key
    ```

2.  選擇建議的預設金鑰類型。
    您可以將選取留空並按下 <shortcut>Enter</shortcut> 以接受預設值。

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

    > 在撰寫本文時，這是 `ECC (sign and encrypt)` 與 `Curve 25519`。
    > 舊版 `gpg` 可能預設為 `RSA` 和 `3072` 位元金鑰大小。
    >
    {style="note"}

3.  當提示指定金鑰的有效期時，您可以選擇預設的永不過期選項。

    如果您選擇建立一個會自動在設定時間後過期的金鑰，則在金鑰過期時，您需要[延長其有效期](https://central.sonatype.org/publish/requirements/gpg/#dealing-with-expired-keys)。

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

4.  輸入您的姓名、電子郵件和可選的註解，將金鑰與身份關聯（您可以將註解欄位留空）：

    ```text
    GnuPG needs to construct a user ID to identify your key.

    Real name: Jane Doe
    Email address: janedoe@example.com
    Comment:
    You selected this USER-ID:
        "Jane Doe <janedoe@example.com>"
    ```

5.  輸入密碼以加密金鑰，並在提示時重複輸入。

    請將此密碼安全且私密地儲存起來。您稍後將需要它來在簽署構件時存取私密金鑰。

6.  使用以下命令查看您建立的金鑰：

    ```bash
    gpg --list-keys
    ```

    輸出看起來會像這樣：

    ```text
    pub   ed25519 2024-10-06 [SC]
          F175482952A225BFD4A07A713EE6B5F76620B385CE
    uid   [ultimate] Jane Doe <janedoe@example.com>
          sub   cv25519 2024-10-06 [E]
    ```

    在接下來的步驟中，您需要使用輸出中顯示的金鑰的長型英數字元識別碼。

</TabItem>
</Tabs>

#### 上傳公開金鑰

您需要[將公開金鑰上傳到金鑰伺服器](https://central.sonatype.org/publish/requirements/gpg/#distributing-your-public-key)，以便 Maven Central 接受它。有多個可用的金鑰伺服器，讓我們使用 `keyserver.ubuntu.com` 作為預設選擇。

<Tabs group ="key-pair-tools">
<TabItem title="使用 Kotlin Gradle 外掛程式" group-key="kgp">

Kotlin Gradle 外掛程式有一個 Gradle 任務，您可以用來上傳公開金鑰。

執行以下命令以上傳您的公開金鑰，提供其路徑：

```bash
./gradlew uploadPublicPgpKey --keyring /path_to/build/pgp/public_KEY_ID.asc
```

</TabItem>
<TabItem title="使用 gpg 工具" group-key="gpg">

您需要[將公開金鑰上傳到金鑰伺服器](https://central.sonatype.org/publish/requirements/gpg/#distributing-your-public-key)，以便 Maven Central 接受它。有多個可用的金鑰伺服器，讓我們使用 `keyserver.ubuntu.com` 作為預設選擇。

執行以下命令以上傳您的公開金鑰，使用 `gpg`，**將您自己的金鑰 ID 替換**到參數中：

```bash
gpg --keyserver keyserver.ubuntu.com --send-keys F175482952A225BFC4A07A715EE6B5F76620B385CE
```

**匯出您的私密金鑰** {id="export-your-private-key"}

要讓您的 Gradle 專案存取您的私密金鑰，您需要將其匯出到二進位檔案中。
系統將提示您輸入建立金鑰時使用的密碼。

使用以下命令，**傳遞您自己的金鑰 ID** 作為參數：

```bash
gpg --no-armor --export-secret-keys F175482952A225BFC4A07A715EE6B5F76620B385CE > key.gpg
```

此命令將建立一個包含您的私密金鑰的 `key.gpg` 二進位檔案（請務必**不要**使用 `--armor` 旗標，該旗標只會建立金鑰的純文字版本）。

> 切勿與任何人分享您的私密金鑰檔案 – 只有您應該有權存取它，
> 因為私密金鑰允許使用您的憑證簽署檔案。
>
{style="warning"}

</TabItem>
</Tabs>

## 配置專案

### 準備您的函式庫專案

如果您從範本專案開始開發您的函式庫，那麼現在是更改專案中任何預設名稱以符合您函式庫名稱的好時機。這包括您的函式庫模組名稱以及頂層 `build.gradle.kts` 檔案中根專案的名稱。

如果您的專案中有 Android 目標，您應該遵循[準備您的 Android 函式庫發行版](https://developer.android.com/build/publish-library/prep-lib-release)的步驟。
最低限度，此過程要求您為您的函式庫[指定一個適當的命名空間](https://developer.android.com/build/publish-library/prep-lib-release#choose-namespace)，以便在編譯其資源時產生一個唯一的 `R` 類別。
請注意，此命名空間與[之前建立的](#choose-and-verify-a-namespace) Maven 命名空間不同。

```kotlin
// build.gradle.kts

android {
    namespace = "io.github.kotlinhandson.fibonacci"
}
```

### 設定發佈外掛程式

本教學使用 [vanniktech/gradle-maven-publish-plugin](https://github.com/vanniktech/gradle-maven-publish-plugin) 來協助向 Maven Central 發佈。
您可以在[此處](https://vanniktech.github.io/gradle-maven-publish-plugin/#advantages-over-maven-publish)閱讀有關該外掛程式優點的更多資訊。
請參閱[外掛程式文件](https://vanniktech.github.io/gradle-maven-publish-plugin/central/)以了解其用法和可用的配置選項。

要將外掛程式添加到您的專案中，請將以下行添加到您的函式庫模組的 `build.gradle.kts` 檔案的 `plugins {}` 區塊中：

```kotlin
// <module directory>/build.gradle.kts

plugins {
    id("com.vanniktech.maven.publish") version "%vanniktechPublishPlugin%" 
}
```

> 有關該外掛程式的最新可用版本，請查看其 [Releases 頁面](https://github.com/vanniktech/gradle-maven-publish-plugin/releases)。
>
{style="note"}

在同一個檔案中，添加以下配置，確保為您的函式庫自訂所有值：

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

> 要配置此項，您也可以使用 [Gradle 屬性](https://docs.gradle.org/current/userguide/build_environment.html)。
>
{style="tip"}

這裡最重要的設定是：

*   `coordinates`，它指定您的函式庫的 `groupId`、`artifactId` 和 `version`。
*   [license](https://central.sonatype.org/publish/requirements/#license-information)，您的函式庫在此許可下發佈。
*   [developer information](https://central.sonatype.org/publish/requirements/#developer-information)，列出了函式庫的作者。
*   [SCM (原始碼管理) information](https://central.sonatype.org/publish/requirements/#scm-information)，指定函式庫原始碼的託管位置。

### 執行本機檢查

在發佈到 Maven Central 之前，最好在本機檢查您的專案是否配置正確。

#### 在本機檢查簽署

透過執行以下命令驗證您的金鑰是否已正確配置用於簽署：

```bash
./gradlew checkSigningConfiguration
```

此 Gradle 任務會檢查您的公開金鑰是否已上傳到 `keyserver.ubuntu.com` 或 `keys.openpgp.org` 金鑰伺服器。

如果任務報告錯誤，請查看輸出以了解如何修復的詳細資訊。

#### 在本機檢查 `pom.xml` 檔案

要將您的函式庫發佈到 Maven Central，`pom.xml` 檔案必須符合 Maven Central 的[要求](https://central.sonatype.org/publish/requirements/#required-pom-metadata)。

對於您計劃發佈的每個函式庫，執行以下命令，將 `<PUBLICATION_NAME>` 替換為發佈名稱：

```bash
./gradlew checkPomFileFor<PUBLICATION_NAME>Publication
```

使用 [vanniktech/gradle-maven-publish-plugin](https://github.com/vanniktech/gradle-maven-publish-plugin) 時，發佈通常命名為 `Maven`。在這種情況下，任務變為：

```bash
./gradlew checkPomFileForMavenPublication
```

如果任務報告錯誤，請查看輸出以了解如何修復的詳細資訊。

## 使用持續整合發佈到 Maven Central

### 產生使用者權杖

您需要 Maven 存取權杖才能讓 Maven Central 授權您的發佈請求。
開啟 [Setup Token-Based Authentication](https://central.sonatype.com/usertoken) 頁面並點擊 **Generate User Token** 按鈕。

輸出看起來像下面的範例，包含一個使用者名稱和一個密碼。
如果您遺失這些憑證，您需要稍後產生新的憑證，因為 Maven Central 不會儲存它們。

```xml
<server>
    <id>${server}</id>
    <username>l2nfaPmz</username>
    <password>gh9jT9XfnGtUngWTZwTu/8141keYdmQpipqLPRKeDLTh</password>
</server>
```

### 將機密添加到 GitHub

為了在您的 GitHub Actions 工作流程中使用發佈所需的金鑰和憑證，同時保持它們的私密性，
您需要將這些值儲存為機密。

1.  在您的 GitHub 儲存庫 **Settings** 頁面，點擊 **Security** | **Secrets and variables** | **Actions**。
2.  點擊 `New repository secret` 按鈕並添加以下機密：

    *   `MAVEN_CENTRAL_USERNAME` 和 `MAVEN_CENTRAL_PASSWORD` 是由 Central Portal 網站[為使用者權杖產生](#generate-the-user-token)的值。
    *   `SIGNING_KEY_ID` 是您簽署金鑰識別碼的**後 8 個字元**，例如 `F175482952A225BFC4A07A715EE6B5F76620B385CE` 的 `20B385CE`。
    *   `SIGNING_PASSWORD` 是您在產生 GPG 金鑰時提供的密碼。
    *   `GPG_KEY_CONTENTS` 應包含您 [key.gpg 檔案](#export-your-private-key)的完整內容。

    ![將機密添加到 GitHub](github_secrets.png){width=700}

您將在下一步的 CI 配置中使用這些機密的名稱。

### 將 GitHub Actions 工作流程添加到您的專案

您可以設定持續整合來自動建構和發佈您的函式庫。
我們將以 [GitHub Actions](https://docs.github.com/en/actions) 為例。

首先，將以下工作流程添加到您的儲存庫的 `.github/workflows/publish.yml` 檔案中：

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

一旦您提交並推送此檔案，只要您在託管專案的 GitHub 儲存庫中建立發行版（包括預發行版），此工作流程就會自動執行。工作流程會檢查您的程式碼的目前版本，設定 JDK，然後執行 `publishToMavenCentral` Gradle 任務。

使用 `publishToMavenCentral` 任務時，您仍需要檢查並在 Maven Central 網站上[手動發佈您的部署](#create-a-release-on-github)。或者，您可以使用 `publishAndReleaseToMavenCentral` 任務來完全自動化發佈過程。

您也可以配置工作流程以在[標籤推送到您的儲存庫時觸發](https://stackoverflow.com/a/61892639)。

> 上述指令稿透過在 Gradle 命令中添加 `--no-configuration-cache` 來禁用發佈任務的 Gradle [配置快取](https://docs.gradle.org/current/userguide/configuration_cache.html)，
> 因為發佈外掛程式不支援它（請參閱此[未解決的問題](https://github.com/gradle/gradle/issues/22779)）。
>
{style="tip"}

此動作需要您的簽署詳細資訊和 Maven Central 憑證，您已將其建立為[儲存庫機密](#add-secrets-to-github)。

工作流程配置會自動將這些機密傳輸到環境變數中，使它們可供 Gradle 建構過程使用。

### 在 GitHub 上建立發行版

設定好工作流程和機密後，您現在可以[建立發行版](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release)來觸發您的函式庫的發佈。

1.  確保您的函式庫的 `build.gradle.kts` 檔案中指定的版本號碼是您想要發佈的版本。
2.  前往您的 GitHub 儲存庫主頁。
3.  在右側邊欄中，點擊 **Releases**。
4.  點擊 **Draft a new release** 按鈕（如果您之前未為此儲存庫建立發行版，則點擊 **Create a new release** 按鈕）。
5.  每個發行版都有一個標籤。在標籤下拉選單中建立一個新標籤，並設定發行標題（標籤名稱和標題可以相同）。
    
    您可能希望這些與您在 `build.gradle.kts` 檔案中指定的函式庫版本號碼相同。

    ![在 GitHub 上建立發行版](create_release_and_tag.png){width=700}

6.  仔細檢查您想要發行版指向的分支（特別是如果它不是預設分支），並為您的新版本添加適當的發行說明。
7.  使用描述下方的核取方塊將發行版標記為預發行版（對於早期存取版本（例如 alpha、beta 或 RC）很有用）。
    
    您也可以將發行版標記為最新版本（如果您之前已為此儲存庫建立過發行版）。
8.  點擊 **Publish release** 按鈕以建立新發行版。
9.  點擊 GitHub 儲存庫頁面頂部的 **Actions** 標籤。在這裡，您會看到新發行版觸發了您的發佈工作流程。
    
    您可以點擊工作流程以查看發佈任務的輸出。
10. 工作流程執行完成後，導覽至 Maven Central 上的 [Deployments](https://central.sonatype.com/publishing/deployments) 儀表板。您應該會在這裡看到一個新的部署。

    此部署可能會在 _pending_ 或 _validating_ 狀態下維持一段時間，同時 Maven Central 執行檢查。

11. 一旦您的部署處於 _validated_ 狀態，請檢查它是否包含您上傳的所有構件。
    如果一切看起來正確，請點擊 **Publish** 按鈕以發佈這些構件。

    ![發佈設定](published_on_maven_central.png){width=700}

    > 發行版後，構件需要一些時間（通常約 15–30 分鐘，但可能長達數小時）才能在 Maven Central 儲存庫中公開可用。它們可能需要更長時間才能被索引並在 [Maven Central 網站](https://central.sonatype.com/)上可搜尋。
    >
    {style="tip"}

要在部署驗證後自動發佈構件，請將工作流程中的 `publishToMavenCentral` 任務替換為 `publishAndReleaseToMavenCentral`。

## 後續步驟

*   [了解更多關於設定多平台函式庫發佈和要求](multiplatform-publish-lib-setup.md)
*   [將 shield.io 徽章添加到您的 README](https://shields.io/badges/maven-central-version)
*   [使用 Dokka 為您的專案分享 API 文件](https://kotl.in/dokka)
*   [添加 Renovate 以自動更新相依性](https://docs.renovatebot.com/)
*   [在 JetBrains 的搜尋平台推廣您的函式庫](https://klibs.io/)
*   [在 `#feed` Kotlin Slack 頻道與社群分享您的函式庫](https://kotlinlang.slack.com/)
    (要註冊，請造訪 https://kotl.in/slack)