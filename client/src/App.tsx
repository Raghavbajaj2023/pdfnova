import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CommandPalette } from "@/components/command-palette";
import { ThemeProvider } from "@/lib/theme";
import { CursorSpotlight } from "@/components/cursor-effects";
import { PageTransition } from "@/components/page-transition";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import ToolsDirectory from "@/pages/tools-directory";
import EditPdfPage from "@/pages/edit-pdf";
import MergePdfPage from "@/pages/merge-pdf";
import SplitPdfPage from "@/pages/split-pdf";
import CompressPdfPage from "@/pages/compress-pdf";
import RotatePdfPage from "@/pages/rotate-pdf";
import DeletePagesPage from "@/pages/delete-pages";
import ExtractPagesPage from "@/pages/extract-pages";
import OrganizePagesPage from "@/pages/organize-pages";
import PdfToJpgPage from "@/pages/pdf-to-jpg";
import JpgToPdfPage from "@/pages/jpg-to-pdf";
import PdfToPngPage from "@/pages/pdf-to-png";
import AddWatermarkPage from "@/pages/add-watermark";
import NumberPagesPage from "@/pages/number-pages";
import GenericToolPage from "@/pages/generic-tool";
import { getToolById } from "@/lib/tools-data";

function GenericRoute({ toolId }: { toolId: string }) {
  const tool = getToolById(toolId);
  if (!tool) return <NotFound />;
  return <GenericToolPage tool={tool} />;
}

function Router() {
  return (
    <PageTransition>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/tools" component={ToolsDirectory} />
        <Route path="/edit-pdf" component={EditPdfPage} />
        <Route path="/merge-pdf" component={MergePdfPage} />
        <Route path="/split-pdf" component={SplitPdfPage} />
        <Route path="/compress-pdf" component={CompressPdfPage} />
        <Route path="/rotate-pdf" component={RotatePdfPage} />
        <Route path="/delete-pages" component={DeletePagesPage} />
        <Route path="/extract-pages" component={ExtractPagesPage} />
        <Route path="/organize-pages" component={OrganizePagesPage} />
        <Route path="/pdf-to-jpg" component={PdfToJpgPage} />
        <Route path="/jpg-to-pdf" component={JpgToPdfPage} />
        <Route path="/pdf-to-png" component={PdfToPngPage} />
        <Route path="/png-to-pdf">{() => <GenericRoute toolId="png-to-pdf" />}</Route>
        <Route path="/html-to-pdf">{() => <GenericRoute toolId="html-to-pdf" />}</Route>
        <Route path="/add-text">{() => <GenericRoute toolId="add-text" />}</Route>
        <Route path="/annotate-pdf">{() => <GenericRoute toolId="annotate-pdf" />}</Route>
        <Route path="/highlight-pdf">{() => <GenericRoute toolId="highlight-pdf" />}</Route>
        <Route path="/draw-on-pdf">{() => <GenericRoute toolId="draw-on-pdf" />}</Route>
        <Route path="/add-images">{() => <GenericRoute toolId="add-images" />}</Route>
        <Route path="/add-watermark" component={AddWatermarkPage} />
        <Route path="/protect-pdf">{() => <GenericRoute toolId="protect-pdf" />}</Route>
        <Route path="/unlock-pdf">{() => <GenericRoute toolId="unlock-pdf" />}</Route>
        <Route path="/redact-pdf">{() => <GenericRoute toolId="redact-pdf" />}</Route>
        <Route path="/sign-pdf">{() => <GenericRoute toolId="sign-pdf" />}</Route>
        <Route path="/request-signature">{() => <GenericRoute toolId="request-signature" />}</Route>
        <Route path="/number-pages" component={NumberPagesPage} />
        <Route path="/repair-pdf">{() => <GenericRoute toolId="repair-pdf" />}</Route>
        <Route path="/crop-pdf">{() => <GenericRoute toolId="crop-pdf" />}</Route>
        <Route component={NotFound} />
      </Switch>
    </PageTransition>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <CursorSpotlight />
          <Toaster />
          <CommandPalette />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
