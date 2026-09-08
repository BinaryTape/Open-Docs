[//]: # (title: 為您的 Kotlin Multiplatform 專案配置 iOS 交付管線)

在本教學中，您將學習如何為具有 iOS 目標的 Kotlin Multiplatform 專案設定 TeamCity Cloud。
您將建立一個 CI 管線，在代管的 macOS 建置代理上建置並測試您的 iOS 應用程式、
配置 Apple 簽名憑據、將組建上傳到 TestFlight，並自動化該流程，以便在每次推送至您的 GitHub 存儲庫時開始新的組建。

[Kotlin Multiplatform IDE 外掛程式](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform) 將引導您直接在 IDE 中完成整個設定過程 — 
從將您的專案連接到 TeamCity Cloud 到發佈您的 iOS 應用程式。

透過此工作流程，TeamCity Cloud 會：

* 提供代管的 macOS 建置代理，因此您不需要自己準備 Mac。
* 為您產生所需的管線配置。
* 為您的組建簽名並將其發佈到 [TestFlight](https://developer.apple.com/testflight/)。
* 提供免費起始方案，每月包含一定的組建分鐘數和存儲空間。

## 建立 TeamCity 管線 {id="create-the-teamcity-pipeline"}

### 從 IDE 開始 CI 設定 {id="start-ci-setup-from-the-ide"}

1. 提交並推送您的專案變更。如果尚未配置 CI，
   Kotlin Multiplatform IDE 外掛程式會顯示一個工具提示，提示您開始 CI 設定。
2. 點擊 **Configure CI**。
   ![推送變更後出現 Configure CI 工具提示](ios-pipeline-Configure-CI.png){width=450 style="block"}
   該外掛程式會產生在代管的 macOS 建置代理上建置和測試 iOS 應用程式所需的檔案。
   這些檔案會新增到您的本機專案中，但尚未提交。
3. 如果未安裝 TeamCity 外掛程式，IDE 會提示您安裝。
   點擊 **Install TeamCity plugin**，然後返回設定流程。
   ![安裝外掛程式以設定 CI/CD](ios-pipeline-install-plugin.png){width=700 style="block"}

    > 您也可以直接從 JetBrains Marketplace 安裝 [TeamCity](https://plugins.jetbrains.com/plugin/25142) 外掛程式。
    >
    {style="note"}

4. 當 IDE 顯示 **Pipeline is ready** 時，初始管線配置已完成。
   點擊 **Continue**，並在提示時允許 IDE 將產生的檔案新增到 Git。
   在您將這些檔案提交到存儲庫之前，它們仍保留在本機。

### 建立或連接 TeamCity Cloud 工作區 {id="create-or-connect-a-teamcity-cloud-workspace"}

TeamCity 需要 Cloud 工作區才能在代管的 macOS 建置代理上執行組建。

1. 閱讀並接受 TeamCity Cloud 服務條款。
2. 點擊 **Create free account** 以建立 TeamCity Cloud 帳戶。

    > TeamCity Cloud 由 JetBrains 代管並提供免費起始方案。
    > 免費方案包含每月的組建分鐘數和存儲空間額度，
    > 足以讓您免費開始並測試此管線。
    > 隨著 CI/CD 需求的增長，您可以隨時升級您的方案。
    >
    {style="note"}

3. 在瀏覽器中，點擊 **Authorize JetBrains** 以授權整合。

TeamCity 會建立或連接到工作區並準備建置環境。
這通常需要不到 30 秒的時間。

## 建置 iOS 應用程式 {id="build-the-ios-app"}

當工作區就緒時，IDE 會自動開啟 **TeamCity** 分頁並開始您的第一次組建。

對於第一次執行，TeamCity 使用您本機未提交的專案檔案。
它會在代管的 macOS 建置代理上建置 iOS 應用程式並執行配置的測試。
這讓您在將任何產生的檔案提交到存儲庫之前，驗證管線是否按預期運作。

![iOS 組建成功](ios-pipeline-first-build.png){width=700 style="block"}

當自動化組建成功後，點擊 **Publish to TestFlight** 以配置簽名和部署。

## 配置 Apple 簽名和 TestFlight {id="configure-apple-signing-and-testflight"}

要將組建上傳到 TestFlight，TeamCity 需要 App Store Connect 和 Apple 程式碼簽名的憑據。

### 建立 App Store Connect API 金鑰 {id="create-an-app-store-connect-api-key"}

1. 登入 [App Store Connect](https://appstoreconnect.apple.com/)。
2. 前往 **Users and Access** 並選擇 **Keys**。
3. 建立一個具有上傳應用程式所需權限的 API 金鑰。
4. 下載私鑰（`.p8` 檔案）。
5. 記下該金鑰顯示的 **Issuer ID** 和 **Key ID**。

您只能下載一次 `.p8` 檔案，因此請妥善儲存。

### 匯出 Apple Distribution 憑證 {id="export-an-apple-distribution-certificate"}

1. 在 Xcode 中，前往 **Settings** | **Accounts**，或開啟 [Apple Developer Portal](https://developer.apple.com/account/)，
   然後建立或找到您的 Apple Distribution 憑證。
2. 在 Mac 上，開啟 **鑰匙圈存取 (Keychain Access)** 並在 **我的憑證** 下找到該憑證。
3. 右鍵點擊該憑證並選擇 **匯出 (Export)** 以將其儲存為 `.p12` 檔案。
4. 設定匯出密碼並妥善儲存；稍後您會用到它。

> 如果您無法使用 Mac，您可以在 Windows 或 Linux 上使用 OpenSSL 
> [產生](https://www.ssl.com/how-to/manually-generate-a-certificate-signing-request-csr-using-openssl/) 
> 憑證簽署請求 (CSR) 並將產生的憑證 
> [轉換](https://www.ssl.com/how-to/create-a-pfx-p12-certificate-file-using-openssl/) 為 `.p12` 檔案。
>
{style="note"}

### 在 IDE 中新增 Apple 憑據 {id="add-apple-credentials-in-the-ide"}

返回 IDE 並填寫 **Add Apple signing credentials** 表單。
TeamCity 將這些值儲存為安全的部署憑據；它們不會被新增到您的專案原始碼檔案中。

|-------------------|----------------------------------------------------------------------------------------------------------------------------------|
| **Issuer ID**     | 識別您的 App Store Connect API 整合。                                                                                             |
| **Key ID**        | 識別您建立的 API 金鑰。                                                                                                           |
| **Private Key**   | 從 App Store Connect 下載的 `.p8` 檔案。                                                                                          |
| **Team ID**       | 您的 Apple Developer 小組識別碼。                                                                                                 |
| **Bundle ID**     | 您應用程式的唯一識別碼（例如 `com.company.app`），如您的應用程式目標中所配置並列於 App Store Connect 中。                            |
| **Certificate**   | 包含私鑰的 `.p12` 發佈憑證。                                                                                                      |
| **.p12 password** | 您在匯出憑證時指定的密碼。                                                                                                        |
{style="none"}

### 將第一次組建上傳到 TestFlight {id="upload-the-first-build-to-testflight"}

新增憑據後，管線將包含簽名和部署步驟。

1. 點擊 **Deploy to TestFlight**。
    TeamCity 會重新執行管線、建立已簽名的 iOS 組建，並將其上傳到 App Store Connect。
2. 開啟 App Store Connect 或 TestFlight 並驗證組建是否出現。

## 自動化組建與發佈 {id="automate-builds-and-publishing"}

### 連接存儲庫 {id="connect-the-repository"}

要自動化此流程，請將您的 GitHub 存儲庫連接到 TeamCity，以便每次推送都觸發新的組建。

1. 在第一個部署管線成功完成後，在 IDE 中點擊 **Connect repository**。
   TeamCity 會在瀏覽器中開啟並確認存儲庫已獲得授權。
   它會自動偵測您的存儲庫和分支並將其附加到管線。
2. 返回 IDE，然後提交並推送產生的管線配置檔案。

現在，每當您向配置的分支推送變更時，TeamCity 都會觸發管線。

### 驗證管線 {id="verify-the-pipeline"}

您的 iOS 交付管線現在已就緒！每次向配置的分支推送都會觸發 TeamCity 執行以下操作：

1. 在代管的 macOS 建置代理上開始組建。
2. 建置 Kotlin Multiplatform 專案。
3. 執行配置的測試。
4. 為 iOS 應用程式簽名。
5. 將新組建上傳到 TestFlight。

![iOS 交付管線已就緒](ios-pipeline-success.png){width=700 style="block"}

點擊 **Done** 以關閉設定流程。

從現在起，只需推送您的程式碼，其餘部分由 TeamCity 處理。

## 接續步驟 {id="what-s-next"}

* 進一步了解 [TeamCity Cloud 管線](https://www.jetbrains.com/help/teamcity/cloud/create-and-edit-pipelines.html) 
  以進一步自訂您的設定：建立更多專案、設定建置代理需求等。
* 了解如何 [發佈多平台應用程式](multiplatform-publish-apps.md)。
* 為 Kotlin Multiplatform 應用程式的持續整合 [配置 GitHub Actions](github-actions-for-kmp.md)。